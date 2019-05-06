document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('submit').onclick = async function(){
        var videoId = document.getElementById('video-id').value
         
        var result = await ((await fetch('/object/'+ videoId)).json())
        console.log(result)
    }
  })
