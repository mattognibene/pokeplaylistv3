const fetch = require('node-fetch');

const NetworkModule = {
    getData: async(url) => {
        const response = await fetch(url, {
            method: 'GET'
        });
        return response.json();
    },

    getData: async(url, bearer) => {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + bearer
            }
        });
        return response.json();
    },
    
    postData: async(url, data = {}) => {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        return response.json();
    }
}

export default NetworkModule