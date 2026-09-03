/* Acceso. La contraseña no está guardada en ningún lado: es la clave con la
   que se descifra la tabla (assets/data.enc.js). Si es incorrecta el descifrado
   falla y no hay nada que mostrar.
   Para cambiarla:  ACS_PASS="nueva clave" node tools/crypt.js encrypt  */
(function(){
  var CACHE="acsData";
  var b=document.body, g=document.getElementById("gate");
  var form=document.getElementById("gateForm"),
      inp=document.getElementById("gatePass"),
      err=document.getElementById("gateErr");

  function boot(json){
    window.ACS=JSON.parse(json);
    b.classList.remove("locked");
    g.remove();
    startApp();
  }

  function bytes(b64){var raw=atob(b64),a=new Uint8Array(raw.length);
    for(var i=0;i<raw.length;i++)a[i]=raw.charCodeAt(i);return a;}

  function decrypt(pass){
    var sub=crypto.subtle;
    return sub.importKey("raw",new TextEncoder().encode(pass),{name:"PBKDF2"},false,["deriveKey"])
      .then(function(base){
        return sub.deriveKey({name:"PBKDF2",salt:bytes(ACS_ENC.salt),iterations:ACS_ENC.iter,hash:"SHA-256"},
          base,{name:"AES-GCM",length:256},false,["decrypt"]);})
      .then(function(key){
        return sub.decrypt({name:"AES-GCM",iv:bytes(ACS_ENC.iv)},key,bytes(ACS_ENC.ct));})
      .then(function(buf){return new TextDecoder().decode(buf);});
  }

  b.classList.add("locked");

  var cached=null;
  try{cached=sessionStorage.getItem(CACHE);}catch(e){}
  if(cached){ boot(cached); return; }

  form.addEventListener("submit",function(e){
    e.preventDefault();
    if(!inp.value) return;
    err.textContent="Unlocking…"; inp.disabled=true;
    decrypt(inp.value).then(function(json){
      JSON.parse(json);                       // clave correcta y JSON sano
      try{sessionStorage.setItem(CACHE,json);}catch(_){}
      boot(json);
    }).catch(function(){
      err.textContent="Wrong password";
      inp.disabled=false; inp.value=""; inp.focus();
    });
  });
  inp.focus();
})();
