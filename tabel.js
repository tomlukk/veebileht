//Autor Walter Võikar

async function createTable(mägede_nimed = []){
  let hinnakiri = await fetchCurrentData();

  if (mägede_nimed.length == 0){
    mägede_nimed = hinnakiri.nimed;
  };
  let tbl  = document.createElement('table');
  let thead = tbl.createTHead();
  let tbody = tbl.createTBody();

  //Tabeli Headeri , mille esimene element on "Pilet"
  let tr = thead.insertRow();
  let pilet = document.createElement('th');
  pilet.setAttribute("rowspan", "3")
  pilet.innerHTML = "Piletid"
  tr.appendChild(pilet);

  //Headerisse rida mägede nimedega
  for (let i = 0; i < mägede_nimed.length; i++){
    let len = hinnakiri[mägede_nimed[i]].hor_len;
    let th = document.createElement('th');
    th.setAttribute("colspan", len)
    th.innerHTML = mägede_nimed[i];
    tr.appendChild(th);
  };

  //Rida vanusegruppidega
  tr = thead.insertRow();
  tr.setAttribute("class", "subheader")
  for (const nimi of mägede_nimed){
    let i = 0;
    for (const vanus of hinnakiri[nimi].vanused){
      let len = hinnakiri[nimi].len_vanusegrupp[i];
      let th = document.createElement('th');
      th.setAttribute("colspan", len)
      th.setAttribute("class", "subheader")
      th.innerHTML = vanus;
      tr.appendChild(th);
      i++
    }
  };

  //Rida pileti tüüpidega
  tr = thead.insertRow();
  tr.setAttribute("class", "subheader")
  for (const nimi of mägede_nimed){
    for (i = 0; i < hinnakiri[nimi].vanused.length; i++){
      for (const tüüp of hinnakiri[nimi].pileti_tüübid){
        let th = document.createElement('th');
        th.setAttribute("class", "subheader")
        th.innerHTML = tüüp;
        tr.appendChild(th);
      }
    };
  };

  let u_keys = []; // Unikaalsed pileti pikkused(kõikide mägede peale kokku)
  let read = []; // Ridade list. Iga rea esimene element on pileti pikkus.
  //Leian ühised pileti pikkused
  for (const nimi of mägede_nimed){
    for (const key of Object.keys(hinnakiri[nimi].hinnad)){
      if(!(u_keys.includes(key))){
        u_keys.push(key);
      }
    }
  } 
  u_keys = u_keysSort(u_keys, hinnakiri.sorted_keys)

  //Teen read erinevatele pileti pikkustele
  for (const key of u_keys){
    let tr = tbody.insertRow()
    tr.setAttribute("id", key)
    let td = document.createElement('td');
    td.innerHTML = key;
    tr.appendChild(td);
    read.push(tr)
  }

  //Appendin reale iga pileti pikkusele vastavad hinnad
  for (const nimi of mägede_nimed){ //Võtan ühe mäe mägede listist ja lisan hinnad tabelisse
    let m_keys = Object.keys(hinnakiri[nimi].hinnad);

    //Kui mäel endal ei ole piletit, mille pikkus on võrdne mõne teise mäe pileti
    //pikkusega, siis genereerin lahtritesse "-"
    for (const key of u_keys){
      if (!(m_keys.includes(key))){
        for (let k of read){
          if(k.getAttributeNode("id").value == key){
            let i = read.indexOf(k);
            let len = hinnakiri[nimi].len_vanusegrupp;
            for (let x of len){
              let n = parseInt(x);
              for (let j = 0; j < n; j++){
                let td = document.createElement('td');
                td.innerHTML = "-";
                k.appendChild(td);
              }
            }
            read[i] = k;
          }
        }
      }
    }
    
    //Lisan pileti hinnad tabelisse.
    for (const key of Object.keys(hinnakiri[nimi].hinnad)){
      for (let k of read){
        if(k.getAttributeNode("id").value == key){
          let i = read.indexOf(k);
          for (const values of Object.values(hinnakiri[nimi].hinnad[key])){
            for (const value of values){
              let td = document.createElement('td');
              td.innerHTML = value + "€";
              k.appendChild(td);
            }
          }
          read[i] = k
          break;
        }
      }
    } 
  }
  document.getElementById("test").innerHTML = "" //Element tühjaks, et saaks lisada uue tabeli
  document.getElementById("test").append(tbl)
}

//Fetchib json failist objektid
async function fetchCurrentData() {
  const response = await fetch('./hinnad.json');
  const json = await response.json();
  return json;
}

//Tagastab sorteeritud võtmete listi
function u_keysSort(u_keys, sorted_keys){
  new_keys = [];
  for (const key of sorted_keys){
    if (u_keys.includes(key)){
      new_keys.push(key);
    }
  }
  return new_keys
}

//Loob tabeli kasutajalt saadud mägede kohta
function loo_tabel(){
  esimene = document.getElementById("esimene").value
  teine = document.getElementById("teine").value
  kolmas = document.getElementById("kolmas").value
  keys = [esimene, teine, kolmas]
  un_keys = []
  for (const key of keys){
    if (!(un_keys.includes(key)) && key != ""){
      un_keys.push(key)
    }
  }
  createTable(un_keys)
}

//eventlistenerid, et pidevalt jälgida kas kasutaja on valinud uue mäe
document.getElementById("esimene").onchange = function() {loo_tabel()};
document.getElementById("teine").onchange = function() {loo_tabel()};
document.getElementById("kolmas").onchange = function() {loo_tabel()};
