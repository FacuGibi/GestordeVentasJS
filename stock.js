window.onload = inicio 

function inicio(){
    document.getElementById('mostrarStock').addEventListener('click', verStock)
}



async function verStock(){
    let art = await axios.get("http://localhost:3000/articulos")

    for(item of art.data){
        document.getElementById("verStock").innerHTML += `${item.nombre} <br>`

    }
    
}