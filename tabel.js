async function tableHead(){
  let hinnakiri = await fetchCurrentData();
  let mägede_nimed = hinnakiri.nimed;

  let body = document.body;
  let tbl  = document.createElement('table');
  let thead = tbl.createTHead();
  let tbody = tbl.createTBody();

  //pilet
  let tr = thead.insertRow();
  let pilet = document.createElement('th');
  pilet.setAttribute("rowspan", "3")
  pilet.innerHTML = "Piletid"
  tr.appendChild(pilet);

  for (let i = 0; i < mägede_nimed.length; i++){
    let len = hinnakiri[mägede_nimed[i]].hor_len;
    let th = document.createElement('th');
    th.setAttribute("colspan", len)
    th.innerHTML = mägede_nimed[i];
    tr.appendChild(th);
  };


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

  let u_keys = [];
  let read = [];
  for (const nimi of mägede_nimed){
    for (const key of Object.keys(hinnakiri[nimi].hinnad)){
      if(!(u_keys.includes(key))){
        u_keys.push(key);
      }
    }
  } 
  for (const key of u_keys){
    let tr = tbody.insertRow()
    tr.setAttribute("id", key)
    let td = document.createElement('td');
    td.innerHTML = key;
    tr.appendChild(td);
    read.push(tr)
  }

  for (const nimi of mägede_nimed){
    let m_keys = Object.keys(hinnakiri[nimi].hinnad);
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
    
    for (const key of Object.keys(hinnakiri[nimi].hinnad)){
      for (let k of read){
        if(k.getAttributeNode("id").value == key){
          console.log(k);
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
  body.appendChild(tbl);
}


async function fetchCurrentData() {
  const response = await fetch('./hinnad.json');
  const json = await response.json();
  return json;
}

tableHead() 