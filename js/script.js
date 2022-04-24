// task поиск, подробнее, категории

const $categories = document.querySelector('.categories')
const $row = document.querySelector('.row')
const $input = document.querySelector('.srcInput')
const $select = document.querySelector('.select')

const baseUrl = 'https://fakestoreapi.com/'

function getRequest(endPoint, cb){
  fetch(`${baseUrl}${endPoint}`)
    .then(res => res.json())
    .then(json => cb(json))
}

window.addEventListener('l oad', () => {
  getRequest('products/categories', cb => {
    categoryTemplate(cb)
  })
  getRequest('products', cb => {
    cardTemplate(cb)
  })
})

$select.addEventListener('change', e => {
  let val = e.target.value
  if(val === 'name'){
    $input.setAttribute('placeholder', 'search by name')
  } else if (val === 'category'){
    $input.setAttribute('placeholder', 'search by category')
  }
})

$input.addEventListener('input', e => {
  let value = e.target.value.toUpperCase()
  let val = $select.value
  if (val === 'name') {
    getRequest(`products`, cb => {
      const filtered = cb.filter(item => item.title.toUpperCase().includes(value))
      cardTemplate(filtered)
    })
  } else if (val === 'category') {
    getRequest(`products`, cb => {
      const filtered = cb.filter(item => item.category.toUpperCase().includes(value))
      cardTemplate(filtered)
    })
  }
})

function categoryTemplate(base){
  const categories = base.map(item => {
    return `
      <div onclick="getCategory('${item}')"> ${item}</div>
    `
  }).join('')
  $categories.innerHTML = categories
  $categories.insertAdjacentHTML('afterbegin', `
    <div onclick="location.reload()">all</div>
  `)
}

function getCategory(el){
  if (el === 'electronics'){
    getRequest(`products/category/electronics`, cb => {
      cardTemplate(cb)
    })
  }else if(el === 'jewelery'){
    getRequest(`products/category/jewelery`, cb => {
      cardTemplate(cb)
    })
  }
}

function cardTemplate(base){
  const newBase = base.map(item => {
    return `
      <div class="card">
        <div class="card_header">
          <h1>${item.title.length > 20 ? item.title.split('').slice(0, 17).join('') +'...' : item.title }</h1>
        </div>
        <div class="card_body">
          <img src="${item.image}">
          <h3>$${item.price}</h3>
        </div>
        <div class="card_footer">
          <button class="card_btn" onclick="getRoute(${item.id})">MORE</button>
        </div>
      </div>
    `
  }).join('')

  $row.innerHTML = newBase
}

function getRoute(id){
  $categories.style.display = 'none'
  getRequest(`products/${id}`, cb => {
    cardMoreTemplate(cb)
  })
}

function cardMoreTemplate(item){
  $row.innerHTML = `
      <div class="more_img">
        <img src="${item.image}">
      </div>
      <div class="moreCard">
        <div class="cardMore_header">
          <h1>${item.title}</h1>
        </div>
        <div class="cardMore_body">
          <h3>$${item.price}</h3>
          <p>${item.description}</p>
          <h3>rate: ${item.rating.rate}</h3>
        </div>
        <div class="cardMore_footer">
          <button class="card_btn_basket" onclick="location.reload()">Exit</button>
        </div>
      </div>
    `
}