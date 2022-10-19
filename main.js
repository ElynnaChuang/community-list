const model = {
  indexURL: 'https://lighthouse-user-api.herokuapp.com/api/v1/users/',
  userPanel: document.querySelector("#user-panel"),
  paginatorPanel: document.querySelector("#paginator-panel"),
  users: [],
  personPerPage: 27,
  currentPage: 1,
}

const view = {
  getPersonPerPage(page){
    const data = model.users
    const startIndex = (page-1) * model.personPerPage
    return data.slice(startIndex, startIndex + model.personPerPage)
  },

  renderPerson(data) {
    model.userPanel.innerHTML = data.map(el =>
      `<div class="col-md-auto p-0 mx-2 my-3">
        <div class="card border-0">
          <div>
            <img src=${el.avatar} class="card-img-top user-avatar" alt="User Avatar" data-bs-toggle="modal" data-bs-target="#user-modal" data-id="${el.id}">
          </div>
          <div class="user-info">
            <p class="my-1 text-center name" data-bs-toggle="modal" data-bs-target="#user-modal" data-id="${el.id}">${el.name}</p>
          </div>
        </div>
      </div>
    `).join('')
  },

  renderPaginator(){
    const data = model.users //取得data
    const pageCount = Math.ceil(data.length/model.personPerPage) //算出要幾頁
    let rawHTML = `
      <li class="page-item active" data-page="1">
        <a class="page-link" href="#" data-page="1">1</a>
      </li>
    `
    for (let page = 2 ; page <= pageCount ; page++) {
      rawHTML +=  `
      <li class="page-item" data-page="${page}">
        <a class="page-link" href="#" data-page="${page}">${page}</a>
      </li>`
    }
    model.paginatorPanel.innerHTML = rawHTML
    model.paginatorPanel.addEventListener('click', event =>{
      model.currentPage = Number(event.target.dataset.page)
      this.renderPerson(this.getPersonPerPage(model.currentPage))
      this.renderPageStatus(model.currentPage)
    })
  },

  renderPageStatus(page) {
    const allPageItems = [...document.querySelectorAll(".page-item")];
    allPageItems.forEach((item) => {
      if (item.classList.contains("active")) {
        item.classList.remove("active");
      }
    });
    const activePage = allPageItems.find(item => Number(item.dataset.page) === page);
    activePage.classList.add("active");
  },

  renderModal(person) {
    const modalImg = document.querySelector("#modal-image")
    const modalName = document.querySelector("#modal-name")
    const modalRegion = document.querySelector("#modal-region")
    const modalBirth = document.querySelector("#modal-birth")
    const modalAge = document.querySelector("#modal-age")
    const modalGender = document.querySelector("#modal-gender")
    const modalEmail = document.querySelector("#modal-email")
    modalImg.textContent = ''
    modalName.textContent = ''
    modalRegion.textContent = ''
    modalBirth.textContent = ''
    modalAge.textContent = ''
    modalGender.textContent = ''
    modalEmail.textContent = ''

    //放入資料
    modalImg.innerHTML = `<img src="${person.avatar}" alt="">`
    modalName.textContent = person.name + person.surname
    modalRegion.textContent = person.region
    modalBirth.textContent = person.birth
    modalAge.textContent = person.age
    modalGender.textContent = person.gender
    modalEmail.textContent = person.email
  },

}

const controller = {
  displayUserList(data) {
    model.users.push(...data); //取得user（放在users[]裡）
    view.renderPerson(view.getPersonPerPage(model.currentPage))
    view.renderPaginator()
  },

  showModal (data) {
    model.userPanel.addEventListener('click', event =>{
      console.log(event.target)
      const id = Number(event.target.dataset.id)
      const person = data.find(el => el.id === id)
      view.renderModal(person)
    })
  }
}

axios
  .get(model.indexURL)
  .then((response) => {
    const data = response.data.results;
    controller.displayUserList(data);
    controller.showModal(data)
  })
  .catch((error) => console.log(error));