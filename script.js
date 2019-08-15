const {render} = ReactDOM;
const {createElement, Component} = React;

const Nav = ({companies, products, page}) => {
  return createElement('div',
    {className: 'nav'},
    createElement('a', {href: '#products', className: page === 'products' ? 'selected' : ''}, `Products (${products.length})`),
    createElement('a', {href: '#companies', className: page === 'companies' ? 'selected' : ''},`Companies (${companies.length})`));
  };

const CompanyList = ({ companies }) => {
  const lis = companies.map(company => createElement('li', { key: company.id }, company.name));
  return createElement('ul', null, lis);
};

const ProductList = ({ products }) => {
  const lis = products.map(product => createElement('li', { key: product.id }, `${product.name} - ${product.description}`));
  return createElement('ul', null, lis);
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      products: [],
      companies: [],
      page: window.location.hash.slice(1)
    };
  }

  async componentDidMount() {
    if(!window.location.hash.slice(1)) {
      window.location.hash = 'products';
    }
    window.addEventListener('hashchange', (ev) => {
      const page = window.location.hash.slice(1);
      this.setState({ page })
    })
    const urls = [
      'https://acme-users-api-rev.herokuapp.com/api/companies',
      'https://acme-users-api-rev.herokuapp.com/api/products',
    ];
      const responses = await Promise.all(urls.map (url => axios.get(url)));
      const [companies, products] = responses.map(response => response.data);

      this.setState({
        companies: companies,
        products: products
      });
  }

  render() {
    const { companies, products, page } = this.state;
    const nav = createElement(Nav, {products, companies, page});
    const title = createElement('h1', null, 'AcmeCompany Product Lister');
    let currentView;
    if(page === 'products') {
      currentView = createElement(ProductList, { products });
    } else if(page === 'companies') {
      currentView = createElement(CompanyList, { companies });
    }
    return createElement('div', null, title, nav, currentView);
  }
}

const root = document.querySelector('#root');
render(createElement(App), root);
