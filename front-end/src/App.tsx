import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import GerenciarEstabelecimento from './pages/GerenciarEstabelecimento';
import GerenciarProdutos from './pages/GerenciarProdutos';
import FormEstabelecimento from './components/FormEstabelecimento';
import FormProduto from './components/FormProduto';
import GerenciarVendas from './pages/GerenciarVendas'
import RealizarVenda from './pages/RealizarVenda';

const App = () => {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<Dashboard />} />
        
        {/* Rotas de Estabelecimento */}
        <Route path="/gerenciar-estabelecimento" element={<GerenciarEstabelecimento />} />
        <Route path="/adicionar-estabelecimento" element={<FormEstabelecimento />} />
        <Route path="/editar-estabelecimento/:id" element={<FormEstabelecimento />} />
        
        {/* Rotas de Produto */}
        <Route path="/gerenciar-produtos" element={<GerenciarProdutos />} />
        <Route path="/adicionar-produto" element={<FormProduto />} />
        <Route path="/editar-produto/:id" element={<FormProduto />} />

        {/* Rota para gerenciar vendas */}
        <Route path="/gerenciar-vendas" element={<GerenciarVendas />} />
        
        {/* Rota para realizar uma venda */}
        <Route path="/realizar-venda" element={<RealizarVenda />} />
        <Route path="/realizar-venda/:id" element={<RealizarVenda />} />
        
      </Routes>
    </Router>
  );
};

export default App;
