import './App.css';
import Home from './components/home/Home';
import Missoes from './components/missoes/Missoes';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";
import Jornal from './components/jornal/Jornal';
import Membros from './components/membros/Membros';
import ImpressaoPosts from './components/impressaoPosts/ImpressaoPosts';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/missoes",
      element: <Missoes />
    },
    {
      path: "/jornal",
      element: <Jornal />
    },
    {
      path: "/membros",
      element: <Membros />
    },
    {
      path: "/imprimir-posts",
      element: <ImpressaoPosts />
    },
  ]);

  return (
    <div>
      <div className="nav">
        <a href="/" style={{marginRight: "10px"}}>Classificação</a>
        <a href="/missoes" style={{marginRight: "10px"}}>Missões</a>
        <a href="/jornal" style={{marginRight: "10px"}}>Jornal</a>
        <a href="/membros" style={{marginRight: "10px"}}>Membros</a>
      </div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
