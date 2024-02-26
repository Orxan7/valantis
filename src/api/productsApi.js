import md5 from "md5";

const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
const password = 'Valantis';
const authString = md5(`${password}_${timestamp}`);


async function getProductIds(params) {
    if (typeof params.offset !== 'number' || typeof params.limit !== 'number') {
        console.warn('getProductIds: Неверные параметры');
        return [];
    }

    const response = await fetch('https://api.valantis.store:41000/', {
        method: 'POST',
        headers: {
            'X-Auth': authString,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "action": "get_ids",
            "params": { "offset": params.offset, "limit": params.limit }
        }),
    });

    if (!response.ok) {
        throw new Error('Ошибка при получении ID товаров');
    }

    const data = await response.json();
    return data.result;
}

async function getProductsByIds(ids) {

    try {
        const response = await fetch('https://api.valantis.store:41000/', {
            method: 'POST',
            headers: {
                'X-Auth': authString,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "action": "get_items",
                "params": { "ids": ids }
            }),
        });

        if (!response.ok) {
            throw new Error('Ошибка при получении информации о товарах');
        }

        const data = await response.json();
        console.log(data)
        return data.result;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export { getProductIds, getProductsByIds };
