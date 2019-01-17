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
    this.props.callback(this.props.product.title);
  }

  render() {
    return (
      <button class="Add-to-cart-button" onClick={this.addToCart.bind(this)}>Add to Cart</button>
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
  render() {
    return (
      <div>
        {this.props.title + ': ' + this.props.count}
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
    var items = []
    Object.keys(cartContents).forEach(function(key) {
      items.push(<CartItem title={key} count={cartContents[key]}/>)
    });

    return (
      <div class={(this.state.cartIsOpen ? 'Cart-open' : 'Cart-closed')} onClick={() => this.handleClick()}>
        <img class="Cart-image" src={require(`./static/bag-icon.png`)}/>
        <span class="Cart-count">{this.props.productsInCart}</span>
        <ul class={(this.state.cartIsOpen ? 'Cart-info-visible' : 'Cart-info-hidden')}>{items}</ul>
        <button class={(this.state.cartIsOpen ? 'Cart-info-visible' : 'Cart-info-hidden')}>Checkout</button>
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

  addToCart(productName) {
    console.log(productName)
    var dict = this.state.cartContents;
    dict[productName] ? dict[productName] += 1 : dict[productName] = 1;
    this.setState({
      productsInCart: this.state.productsInCart + 1,
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
      <div>
        <Cart productsInCart={this.state.productsInCart} cartContents={this.state.cartContents}/>
        <ProductTable products={this.state.productList} callback={this.addToCart.bind(this)}/>
      </div>
    );
  }

}

export default App;
