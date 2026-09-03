/* Acceso simple. Ojo: el sitio es público (GitHub Pages), así que esto
   frena al curioso, no es seguridad real.
   Para cambiar la clave:  printf %s "nuevaClave" | sha256sum   y pegar el hash acá. */
(function(){
  var HASH="0b00d0c287829e181b2689b7815651cfa14b32d566c6392e8d6a616aa5570994";
  var b=document.body, g=document.getElementById("gate");
  function abrir(){ b.classList.remove("locked"); g.remove(); }
  function sha256(t){
    return crypto.subtle.digest("SHA-256",new TextEncoder().encode(t)).then(function(h){
      return Array.from(new Uint8Array(h)).map(function(x){return x.toString(16).padStart(2,"0")}).join("");
    });
  }
  b.classList.add("locked");
  if(sessionStorage.getItem("acsOk")==="1"){ abrir(); return; }
  document.getElementById("gateForm").addEventListener("submit",function(e){
    e.preventDefault();
    var inp=document.getElementById("gatePass");
    sha256(inp.value).then(function(h){
      if(h===HASH){
        try{sessionStorage.setItem("acsOk","1")}catch(_){}
        abrir();
      }else{
        document.getElementById("gateErr").textContent="Contraseña incorrecta";
        inp.value="";
      }
    });
  });
  document.getElementById("gatePass").focus();
})();
