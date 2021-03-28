
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import BrowseProductsPage from "./pages/browse-products/BrowseProductsPage";
import AddNewProduct from './pages/new-product/AddNewProductPage'
import ScanTest from "./pages/scan-test/ScanTestPage";
import { GroceriesTodo } from "./routes/groceries-todo";
 
export default function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/browse">Browse products</Link>
            </li>
            <li>
              <Link to="/new-product">Add new item</Link>
            </li>
            <li>
              <Link to="/groceries-todo">Groceries to buy</Link>
            </li>
            <li>
              <Link to="/scan-test">Test scanner</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
        <Route path="/browse">
            <BrowseProductsPage />
          </Route>
          <Route path="/new-product">
            <AddNewProduct />
          </Route>
          <Route path="/groceries-todo">
            <GroceriesTodo />
          </Route>
          <Route path="/scan-test">
            <ScanTest />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
 
function Home() {
  return <h2>Home</h2>;
}
