import React from 'react'
import { useState, useEffect } from 'react'
import { commerce } from './lib/commerce'
import { Products, Navbar, Cart } from './components'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
const App = () => {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState({})

  const fetchProducts = async () => {
    console.log('in fetch Products')
    const { data } = await commerce.products.list()
    setProducts(data)
  }
  const fetchCart = async () => {
    console.log('In Fetch Cart')
    setCart(await commerce.cart.retrieve())
  }

  useEffect(() => {
    console.log('in useEffect')
    fetchProducts()
    fetchCart()
  }, [])
  const handleAddToCart = async (productId, quantity) => {
    const item = await commerce.cart.add(productId, quantity)
    setCart(item.cart)
  }
  const handleUpdateCartQty = async (productID, quantity) => {
    const { cart } = await commerce.cart.add(productID, quantity)
    setCart(cart)
  }

  const handleRemoveFromCart = async (productId) => {
    const { cart } = await commerce.cart.remove(productId)
    setCart(cart)
  }
  const handleEmptyCart = async () => {
    const { cart } = await commerce.cart.empty()
    setCart(cart)
  }
  return (
    <Router>
      <div>
        <Navbar totalItems={cart.total_items} />
        <Switch>
          <Route exact path='/'>
            <Products products={products} onAddToCart={handleAddToCart} />
          </Route>
          <Route exact path='/cart'>
            <Cart
              cart={cart}
              handleUpdateCartQty={handleUpdateCartQty}
              handleRemoveFromCart={handleRemoveFromCart}
              handleEmptyCart={handleEmptyCart}
            />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}
export default App
