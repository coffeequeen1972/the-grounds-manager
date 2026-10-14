import { Route, Switch, Router as WouterRouter } from 'wouter';
import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import Inventory from './pages/Inventory';
import Tasks from './pages/Tasks';
import Notes from './pages/Notes';
import NotFound from './pages/not-found';
import { StoreProvider } from './lib/store';

function App() {
  return <StoreProvider>
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Switch>
        <Route path="/" component={Dashboard}/>
        <Route path="/schedule" component={Schedule}/>
        <Route path="/inventory" component={Inventory}/>
        <Route path="/tasks" component={Tasks}/>
        <Route path="/notes" component={Notes}/>
        <Route component={NotFound}/>
      </Switch>
    </WouterRouter>
  </StoreProvider>;
}

export default App;
