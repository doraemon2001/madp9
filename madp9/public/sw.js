(function(){

  // method that runs when service worker is installed first time
  self.addEventListener('install',event =>{
      console.log('service worker installing');
      // loading static html into cache first
      event.waitUntil(
          caches
            .open('PWD_app')
            .then(cache =>
              cache.addAll([
                '/git'
              ])
            )
        )
      self.skipWaiting();
  })

  // method that runs when the service worker is activated
  self.addEventListener('activate',event=>{
      event.waitUntil(caches.delete('PWD_app'));
      console.log('service worker activating...')
  })

  // method that will run when the app makes fetch calls 
  self.addEventListener('fetch',event=>{
      console.log('fetching',event.request.url);
      event.respondWith(
          // checking if the response is already in cache
          caches.match(event.request).then(async (response) => {
            if (response) {
              //found an entry in the cache!
              return response
            }
          
          // loading fetch responces into cache (conditional fetch need to be implemented to avoid unwanted caching)
          let data = fetch(event.request);
          let data_clone = (await data).clone();
          event.waitUntil(caches.open('PWD_app').then(cache => cache.put(event.request, data_clone)));
          
          return data


            
          })
        )
  })
})

()