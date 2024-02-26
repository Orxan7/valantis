import md5 from "md5";

const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
const password = 'Valantis';
const authString = md5(`${password}_${timestamp}`);

async function getFilteredProductIds(params) {
    const filteredParams = {};

    if (params.price) filteredParams["price"] = Number(params.price);
    if (params.name) filteredParams["product"] = params.name;
    if (params.brand) filteredParams["brand"] = params.brand;

    console.log(filteredParams)

    const body = JSON.stringify({
        action: "filter",
        params: filteredParams
    });

    try {
        const response = await fetch('https://api.valantis.store:41000/', {
            method: 'POST',
            headers: {
                'X-Auth': authString,
                'Content-Type': 'application/json',
            },
            body: body
        });

        if (!response.ok) {
            throw new Error('Ошибка при получении ID товаров');
        }

        const data = await response.json();
        console.log(data);

        return data.result;
    } catch (error) {
        console.error(error);
        return [];
    }
}


export { getFilteredProductIds };
