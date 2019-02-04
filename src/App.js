import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import PropTypes from 'prop-types';

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
  addToCart(event) {
    var selectedSize = "";
    for (var i = 0; i < this.props.product.availableSizes.length; i++){
      var cur = this.props.product.availableSizes[i];
      if(document.getElementById(this.props.product.title + cur).checked) selectedSize = cur;
    }
    this.props.callback(this.props.product.title, selectedSize);
  }

  render() {
    const sizes = this.props.product.availableSizes;
    const sizeGallery = sizes ? sizes.map(size => (
        <label class="radio-inline">
          <input type="radio" name="optradio" id={this.props.product.title + size} checked/>{size}
        </label>
    )) : (<div>No Data</div>);

    return (
      <div>
        <form>
          {sizeGallery}
        </form>
        <button class="Button" onClick={this.addToCart.bind(this)}>Add to Cart</button>
      </div>
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
        <AddToCartButton callback={this.props.callback} product={this.props.product} />
      </div>
    );
  }
}

class CartItem extends React.Component {
  removeFromCart(event) {
    this.props.callback(this.props.title, this.props.size);
  }

  render() {
    return (
      <div>
        <button class="Button" onClick={this.removeFromCart.bind(this)}>-</button>
        {this.props.size + " " + this.props.title + ': ' + this.props.count}
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
  };

  handleClick = (event) => {   
    this.setState({
      cartIsOpen: this.state.cartIsOpen ? false : true
    });
  };

  render() {
    const cartContents = this.props.cartContents;
    var callback = this.props.callback;
    var items = [];
    Object.keys(cartContents).forEach(function(product) {
      Object.keys(cartContents[product]).forEach(function(size){
        if(cartContents[product][size] > 0) {
          items.push(<CartItem callback={callback} title={product} size={size} count={cartContents[product][size]}/>);
        }
      });
    });

    return (
      <div class={(this.state.cartIsOpen ? 'Cart-open Hover' : 'Cart-closed Hover')}>
        <img class="Cart-image" src={require(`./static/bag-icon.png`)} onClick={() => this.handleClick()}/>
        <span class="Cart-count">{this.props.productsInCart}</span>
        <ul class={(this.state.cartIsOpen ? 'Visible' : 'Hidden')}>{items}</ul>
        <button class={(this.state.cartIsOpen ? 'Visible Button' : 'Hidden')}>Checkout</button>
      </div>
    );
  }
}


class ProductTable extends Component {
  render() {
    const products = this.props.products;
    const gallery = products ? products.map(product => (
      <ProductCard callback={this.props.callback} product={product}/>
    )) : (<div>No Data</div>);
    
    return(
      <ul class="Product-table">{gallery}</ul>
    )
  }
}

class App extends Component {

  constructor(props) 
  {
    super(props)
    this.state = {
      productList: null,
      productsInCart: 0,
      cartContents: {}
    }
  }

  addToCart(productName, size) {
    var dict = this.state.cartContents;
    const productEntry = {};
    productEntry[size] = 1;
    if(dict[productName]){
      dict[productName][size] ? dict[productName][size] += 1 : dict[productName][size] = 1;
    } else {
      dict[productName] = productEntry;
    }
    this.setState({
      productsInCart: this.state.productsInCart + 1,
      cartContents: dict
    });
  };

  removeFromCart(productName, size) {
    var dict = this.state.cartContents;
    dict[productName][size] -= 1;
    this.setState({
      productsInCart: this.state.productsInCart - 1,
      cartContents: dict
    });
  };

  componentDidMount() {
    import("./products.json")
    .then(json => this.setState({productList: json.default.products}))
  }

  render() {
    let my_json = {}

    return (
      <div class="App-area">
        <ProductTable products={this.state.productList} callback={this.addToCart.bind(this)}/>
        <Cart productsInCart={this.state.productsInCart} cartContents={this.state.cartContents} callback={this.removeFromCart.bind(this)} products={this.state.productList}/>
      </div>
    );
  }
}

export default App;
