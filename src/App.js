import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class ProductInformation extends React.Component {
  render() {
    const product = this.props.product;
    return (
      <div class="Product-information">
        <div class="Product-title">{product.title}</div>
        <div class="Product-price">${product.price}</div>
      </div>
    );
  }
}

class AddToCartButton extends React.Component {
  state = {
    amountInCart: 0
  };

  render() {
    const product = this.props.product;
    return (
      <button class="Add-to-cart-button">Add to Cart</button>
    );
  }
}

class ProductCard extends React.Component {
  render() {
    const product = this.props.product;
    return (
      <div class="Product-card">
        <img class="Product-image" src={require(`./static/products/${product.sku}_1.jpg`)}/>
        <ProductInformation product={this.props.product}/>
        <AddToCartButton product={this.props.product} />
      </div>
    );
  }
}

class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  state = {
    cartIsOpen: false,
    cartCount: 0
  };

  handleClick = (event) => {   
    this.setState({
      cartIsOpen: this.state.cartIsOpen ? false : true
    });
  };

  render() {
    return (
      <div class={(this.state.cartIsOpen ? 'Cart-open' : 'Cart-closed')} onClick={() => this.handleClick()}>
        <img class="Cart-image" src={require(`./static/bag-icon.png`)}/>
        <span class="Cart-count">{this.state.cartCount}</span>
      </div>
    );
  }
}


class ProductTable extends Component {
  render() {
    const products = this.props.products;
    const gallery = products ? products.map(product => (
      <ProductCard product={product}/>
    )) : (<div>No Data</div>);
    console.log(gallery);
    return(
      <ul class="Product-table">{gallery}</ul>
    )
  }
}

function addCartItem(productDict, productName) {
  if(productDict[productName]){
    productDict[productName] += 1;
  } else {
    productDict[productName] = 1;
  }
}

class App extends Component {

  constructor(props) 
  {
    super(props)
    this.state = {
      productList: null,
      productsInCart: {},
    }
  }

  handleAddToCart = (event, productName) => {
    this.setState({
      productsInCart: addCartItem(this.state.productsInCart, productName)
    });
  };

  componentDidMount() {
    import("./products.json")
    .then(json => this.setState({productList: json.default.products}))
  }

  render() {
    let my_json = {}

    return (
      <div>
        <ProductTable products={this.state.productList} />
        <Cart />
      </div>
    );
  }

}

export default App;
