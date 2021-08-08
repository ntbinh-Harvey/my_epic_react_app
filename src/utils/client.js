async function client(endpoint,{data, token, header: customHeaders, ...customConfig} = {}) {
    return window
      .fetch(`${process.env.REACT_APP_API_URL}/${endpoint}`, {
        method: data ? 'POST' : 'GET',
        body: data ? JSON.stringify(data) : undefined,
        header: {
            'Content-Type': data ? 'application/json' : undefined,
            Authorization: `Bearer ${token}`,
            ...customHeaders,
        },
        ...customConfig,
      })
      .then(async response => {
        const data = await response.json();
        if(response.ok) {
          return data
        }
        else {
          return Promise.reject(data)
        } 
      })
  }
  
  export {client}
