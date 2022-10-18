const indexURL = "https://lighthouse-user-api.herokuapp.com/api/v1/users/";
const userPanel = document.querySelector("#user-panel");
const users = [];

function renderUsers(data) {
  let rawHTML = "";
  data.forEach((item) => {
    // item.name
    rawHTML += `
    <div class="col-md-auto p-0 mx-2 my-3">
      <div class="card border-0">
        <div>
          <img src=${item.avatar} class="card-img-top user-avatar" alt="User Avatar" data-bs-toggle="modal" data-bs-target="#user-modal" data-id="${item.id}">
        </div>
        <div class="user-info">
          <p class="my-1 text-center name">${item.name}</p>
        </div>
      </div>
    </div>
    `;
  });
  userPanel.innerHTML = rawHTML;
}

function showUserModal(id) {
  const modalImage = document.querySelector("#modal-image");
  const modalName = document.querySelector("#modal-name");
  const modalRegion = document.querySelector("#modal-region");
  const modalBirth = document.querySelector("#modal-birth");
  const modalAge = document.querySelector("#modal-age");
  const modalGender = document.querySelector("#modal-gender");
  const modalEmail = document.querySelector("#modal-email");

  // 先將 modal 內容清空，以免出現上一個 user 的資料殘影
  modalImage.innerHTML = "";
  modalName.innerText = "";
  modalRegion.innerText = "";
  modalBirth.innerHTML = "";
  modalAge.innerHTML = "";
  modalGender.innerHTML = "";
  modalEmail.innerHTML = "";

  axios
    .get(indexURL + id)
    .then((response) => {
      const data = response.data;
      modalImage.innerHTML = `<img src="${data.avatar}" alt="User Avatar" class=" float-end">`;
      modalName.innerText = `${data.name} ${data.surname}`;
      modalRegion.innerText = data.region;
      modalBirth.innerHTML = `
      <i class="fa-solid fa-calendar-days modal-icon"></i>
      ${data.birthday}
      `;
      modalAge.innerHTML = `
      <i class="fa-solid fa-cake-candles modal-icon"></i>
      age ${data.age}
      `;
      modalGender.innerHTML = `
      <i class="fa-solid fa-mars-and-venus modal-icon"></i>
      ${data.gender}
      `;
      modalEmail.innerHTML = `
      <i class="fa-solid fa-envelope modal-icon"></i>
      ${data.email}
      `;
    })
    .catch((error) => console.log(error));
}

axios
  .get(indexURL)
  .then((response) => {
    const data = response.data.results;
    //取得user（放在users[]裡）
    users.push(...data);
    //執行render畫面的function
    renderUsers(users);
  })
  .catch((error) => console.log(error));

userPanel.addEventListener("click", function clickImage(event) {
  if (event.target.matches(".user-avatar")) {
    showUserModal(Number(event.target.dataset.id));
  }
});
