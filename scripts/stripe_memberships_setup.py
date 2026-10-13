#!/usr/bin/env python3
"""Idempotent Stripe setup for Real Time Traders paid memberships.
Reads STRIPE_SECRET_KEY from env (never printed). Creates/updates:
  - one Product per tier (metadata app=rtt, tier=<tier>)
  - one monthly AUD Price per tier with lookup_key rtt_<tier>_monthly
  - a dedicated (non-default) Customer Portal configuration (metadata app=rtt)
Prints only object IDs. Usage: python3 scripts/stripe_memberships_setup.py [--webhook we_...]
"""
import json, os, sys, urllib.parse, urllib.request

KEY = os.environ["STRIPE_SECRET_KEY"]
SITE = "https://realtimetradersbrisbane.au"
TIERS = [("basic", "Basic", 499), ("bronze", "Bronze", 1999), ("silver", "Silver", 3999), ("gold", "Gold", 7999)]

def enc(d, p=""):
    out = []
    for k, v in d.items():
        key = f"{p}[{k}]" if p else k
        if isinstance(v, dict): out += enc(v, key)
        elif isinstance(v, list):
            for i, x in enumerate(v):
                out += enc(x, f"{key}[{i}]") if isinstance(x, dict) else [(f"{key}[{i}]", str(x))]
        elif v is not None: out.append((key, str(v).lower() if isinstance(v, bool) else str(v)))
    return out

def api(method, path, data=None):
    body = urllib.parse.urlencode(enc(data or {})).encode() if method == "POST" else None
    url = "https://api.stripe.com/v1/" + path
    if method == "GET" and data: url += "?" + urllib.parse.urlencode(enc(data))
    req = urllib.request.Request(url, data=body, method=method, headers={"Authorization": "Bearer " + KEY})
    try:
        with urllib.request.urlopen(req) as r: return json.load(r)
    except urllib.error.HTTPError as e:
        sys.exit(f"Stripe {method} {path}: {e.code} {json.load(e).get('error', {}).get('message')}")

prices = {}
existing = {p["lookup_key"]: p for p in api("GET", "prices", {"lookup_keys": [f"rtt_{t}_monthly" for t, _, _ in TIERS], "limit": 10, "expand": ["data.product"]})["data"]}
for tier, name, cents in TIERS:
    lk = f"rtt_{tier}_monthly"
    prod_fields = {"name": f"Real Time Traders {name} membership",
                   "description": f"{name} membership for Real Time Traders (realtimetradersbrisbane.au), billed monthly.",
                   "statement_descriptor": "REALTIMETRADERS", "url": f"{SITE}/membership.html",
                   "metadata": {"app": "rtt", "tier": tier}}
    p = existing.get(lk)
    if p and p["unit_amount"] == cents and p["currency"] == "aud" and p["recurring"]["interval"] == "month" and p["active"]:
        prod = api("POST", f"products/{p['product']['id']}", prod_fields)
        prices[tier] = p["id"]; print(f"{tier}: product {prod['id']} price {p['id']} (existing)"); continue
    prods = api("GET", "products/search", {"query": f"metadata['app']:'rtt' AND metadata['tier']:'{tier}'"})["data"]
    prod = api("POST", f"products/{prods[0]['id']}", prod_fields) if prods else api("POST", "products", prod_fields)
    price = api("POST", "prices", {"product": prod["id"], "currency": "aud", "unit_amount": cents,
                                   "recurring": {"interval": "month"}, "tax_behavior": "inclusive",
                                   "lookup_key": lk, "transfer_lookup_key": True, "nickname": f"{name} monthly",
                                   "metadata": {"app": "rtt", "tier": tier}})
    api("POST", f"products/{prod['id']}", {"default_price": price["id"]})
    prices[tier] = price["id"]; print(f"{tier}: product {prod['id']} price {price['id']} (created)")

portal = {
    "business_profile": {"headline": "Real Time Traders: manage your membership",
                         "privacy_policy_url": f"{SITE}/privacy.html", "terms_of_service_url": f"{SITE}/terms.html"},
    "default_return_url": f"{SITE}/account.html",
    "features": {
        "customer_update": {"enabled": True, "allowed_updates": ["email", "name"]},
        "invoice_history": {"enabled": True},
        "payment_method_update": {"enabled": True},
        "subscription_cancel": {"enabled": True, "mode": "at_period_end",
                                "cancellation_reason": {"enabled": True, "options": ["too_expensive", "unused", "switched_service", "other"]}},
        "subscription_update": {"enabled": True, "default_allowed_updates": ["price"], "proration_behavior": "create_prorations",
                                "products": [{"product": api("GET", f"prices/{prices[t]}")["product"], "prices": [prices[t]]} for t, _, _ in TIERS]},
    },
    "metadata": {"app": "rtt"},
}
cfgs = [c for c in api("GET", "billing_portal/configurations", {"limit": 100})["data"] if c.get("metadata", {}).get("app") == "rtt"]
cfg = api("POST", f"billing_portal/configurations/{cfgs[0]['id']}" if cfgs else "billing_portal/configurations", portal)
print("portal configuration:", cfg["id"], "(updated)" if cfgs else "(created)")

if "--webhook" in sys.argv:
    we = sys.argv[sys.argv.index("--webhook") + 1]
    events = ["setup_intent.succeeded", "payment_method.attached", "checkout.session.completed",
              "customer.subscription.created", "customer.subscription.updated", "customer.subscription.deleted",
              "invoice.payment_failed"]
    w = api("POST", f"webhook_endpoints/{we}", {"enabled_events": events})
    print("webhook", w["id"], "events:", ",".join(w["enabled_events"]))
