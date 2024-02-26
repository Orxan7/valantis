import md5 from "md5";

const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
const password = 'Valantis';
const authString = md5(`${password}_${timestamp}`);


async function getProductIds(params) {
    console.log(params)
    const response = await fetch('http://api.valantis.store:40000/', {
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
    const response = await fetch('http://api.valantis.store:40000/', {
        method: 'POST',
        headers: {
            'X-Auth': authString,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "action": "get_items",
            "params": {"ids": ids}
        }),
    });

    if (!response.ok) {
        throw new Error('Ошибка при получении информации о товарах');
    }

    const data = await response.json();
    console.log(data)
    return data.result;
}

export { getProductIds, getProductsByIds };
