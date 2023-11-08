export default {
	async fetch(request, env) {
		const proxyApiKey = env.SHOPIFY_API_KEY;
		const proxySecret = env.PROXY_SECRET;
		const proxyBearer = request.headers?.get('Authorization')?.replace('Basic ', '');
		if (proxyBearer !== btoa(`${proxyApiKey}:${proxySecret}`)) {
			return new Response('Invalid auth', { status: 403 });
		}

		const url = new URL(request.url);
		const shopName = env.SHOP_NAME;
		const shopifyUrl = `https://${shopName}${url.pathname}${url.search}`;
		const modifiedRequest = new Request(shopifyUrl, request);

		const orderRegex = /\/admin\/api\/2020-07\/orders\/(\d+)\.json/;
		const transactionRegex = /\/admin\/api\/2020-07\/orders\/(\d+)\/transactions.json/;

		let allowed = false;
		if (url.pathname === '/admin/oauth/access_scopes.json') {
			allowed = true;
		} else if (url.pathname === '/admin/api/2020-07/orders/count.json') {
			allowed = true;
		} else if (orderRegex.test(url.pathname)) {
			if (
				(request.method === 'GET' && url.search === '?fields=id') ||
				url.search === '?fields=id,order_number,total_price,total_outstanding,currency,presentment_currency,transactions,financial_status'
			) {
				allowed = true;
			} else if (request.method === 'PUT') {
				allowed = true;
			}
		} else if (transactionRegex.test(url.pathname)) {
			allowed = true;
		}

		if (!allowed) {
			return new Response('Blocked Path', { status: 403 });
		}

		const shopifyApiKey = env.SHOPIFY_API_KEY;
		const shopifyAdminApiSecret = env.SHOPIFY_ADMIN_API_SECRET;
		const bearer = btoa(`${shopifyApiKey}:${shopifyAdminApiSecret}`);
		let response = await fetch(modifiedRequest, { headers: { Authorization: `Basic ${bearer}` } });
		return response;
	},
};
