document.addEventListener('DOMContentLoaded', () => {
  const stocksData = JSON.parse(stockContent);
  const userData = JSON.parse(userContent);

  const saveButton = document.querySelector('#btnSave');
  const deleteButton = document.querySelector('#btnDelete');

  generateUserList(userData, stocksData);

  saveButton.addEventListener('click', (event) => {
    event.preventDefault();

    const id = document.querySelector('#userID').value;

    for (let i = 0; i < userData.length; i++) {
      if (userData[i].id == id) {
        userData[i].user.firstname = document.querySelector('#firstname').value;
        userData[i].user.lastname = document.querySelector('#lastname').value;
        userData[i].user.address = document.querySelector('#address').value;
        userData[i].user.city = document.querySelector('#city').value;
        userData[i].user.email = document.querySelector('#email').value;

        generateUserList(userData, stocksData);
        break;
      }
    }
  });

  deleteButton.addEventListener('click', (event) => {
    event.preventDefault();

    const userId = document.querySelector('#userID').value;
    const userIndex = userData.findIndex(user => user.id == userId);
    
    if (userIndex !== -1) {
      userData.splice(userIndex, 1);
      
      clearForm();
      
      const portfolioDetails = document.querySelector('.portfolio-list');
      portfolioDetails.innerHTML = '';
      
      clearStockInfo();
      
      generateUserList(userData, stocksData);
    }
  });
});

function generateUserList(users, stocks) {
  const userList = document.querySelector('.user-list');
  
  userList.innerHTML = '';
  
  users.map(({user, id}) => {
    const listItem = document.createElement('li');
    listItem.innerText = user.lastname + ', ' + user.firstname;
    listItem.setAttribute('id', id);
    listItem.style.cursor = 'pointer';
    userList.appendChild(listItem);
  });

  userList.addEventListener('click', (event) => handleUserListClick(event, users, stocks));
}

function handleUserListClick(event, users, stocks) {
  const userId = event.target.id;
  
  const user = users.find(user => user.id == userId);
  
  if (user) {
    populateForm(user);
    renderPortfolio(user, stocks);
  }
}

function populateForm(data) {
  const { user, id } = data;
  
  document.querySelector('#userID').value = id;
  document.querySelector('#firstname').value = user.firstname;
  document.querySelector('#lastname').value = user.lastname;
  document.querySelector('#address').value = user.address;
  document.querySelector('#city').value = user.city;
  document.querySelector('#email').value = user.email;
}

function renderPortfolio(user, stocks) {
  const { portfolio } = user;
  
  const portfolioDetails = document.querySelector('.portfolio-list');
  
  portfolioDetails.innerHTML = '';
  
  const headerRow = document.createElement('div');
  headerRow.style.display = 'grid';
  headerRow.style.gridTemplateColumns = '1fr 1fr auto';
  headerRow.style.gap = '10px';
  headerRow.style.fontWeight = 'bold';
  headerRow.style.marginBottom = '10px';
  headerRow.innerHTML = '<span>Symbol</span><span>Shares Owned</span><span>Action</span>';
  portfolioDetails.appendChild(headerRow);
  
  portfolio.map(({ symbol, owned }) => {
    const rowContainer = document.createElement('div');
    rowContainer.style.display = 'grid';
    rowContainer.style.gridTemplateColumns = '1fr 1fr auto';
    rowContainer.style.gap = '10px';
    rowContainer.style.alignItems = 'center';
    rowContainer.style.marginBottom = '5px';
    
    const symbolEl = document.createElement('p');
    const sharesEl = document.createElement('p');
    const actionEl = document.createElement('button');
    
    symbolEl.innerText = symbol;
    sharesEl.innerText = owned;
    actionEl.innerText = 'View';
    actionEl.setAttribute('id', symbol);
    actionEl.style.cursor = 'pointer';
    
    symbolEl.style.margin = '0';
    sharesEl.style.margin = '0';
    
    rowContainer.appendChild(symbolEl);
    rowContainer.appendChild(sharesEl);
    rowContainer.appendChild(actionEl);
    
    portfolioDetails.appendChild(rowContainer);
  });
  
  portfolioDetails.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
      viewStock(event.target.id, stocks);
    }
  });
}

function viewStock(symbol, stocks) {
  const stock = stocks.find(function (s) { 
    return s.symbol === symbol;
  });
  
  if (stock) {
    document.querySelector('#stockName').textContent = stock.name;
    document.querySelector('#stockSector').textContent = stock.sector;
    document.querySelector('#stockIndustry').textContent = stock.subIndustry;
    document.querySelector('#stockAddress').textContent = stock.address;
    
    const logoElement = document.querySelector('#logo');
    if (logoElement) {
      logoElement.src = `logos/${symbol}.svg`;
      logoElement.alt = `${stock.name} logo`;
    }
    
    const stockArea = document.querySelector('.stock-form');
    if (stockArea) {
      stockArea.style.display = 'block';
    }
  }
}

function clearForm() {
  document.querySelector('#userID').value = '';
  document.querySelector('#firstname').value = '';
  document.querySelector('#lastname').value = '';
  document.querySelector('#address').value = '';
  document.querySelector('#city').value = '';
  document.querySelector('#email').value = '';
}

function clearStockInfo() {
  document.querySelector('#stockName').textContent = '';
  document.querySelector('#stockSector').textContent = '';
  document.querySelector('#stockIndustry').textContent = '';
  document.querySelector('#stockAddress').textContent = '';
  
  const logoElement = document.querySelector('#logo');
  if (logoElement) {
    logoElement.src = '';
    logoElement.alt = '';
  }
  
  const stockArea = document.querySelector('.stock-form');
  if (stockArea) {
    stockArea.style.display = 'none';
  }
}