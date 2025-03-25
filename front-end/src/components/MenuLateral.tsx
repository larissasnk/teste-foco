import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiMapPin, FiShoppingBag, FiDollarSign, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const MenuLateral: React.FC = () => {
  const [recolhido, setRecolhido] = useState(false);
  const [hover, setHover] = useState(false);

  const toggleMenu = () => {
    setRecolhido(!recolhido);
  };

  return (
    <div 
      className={`h-screen text-white p-4 transition-all duration-300 ease-in-out ${recolhido && !hover ? 'w-20' : 'w-52'}`}
      style={{
        background: 'linear-gradient(to bottom, oklch(0.707 0.165 254.624), oklch(0.282 0.091 267.935))'
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="flex flex-col space-y-3 h-full">
        {/* Botão de toggle */}
        <button 
          onClick={toggleMenu}
          className="flex items-center justify-center p-2 rounded-lg backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-all border border-white/20 mb-4"
        >
          {recolhido && !hover ? (
            <FiChevronRight className="text-xl" style={{ color: 'oklch(0.9 0.05 265)' }} />
          ) : (
            <FiChevronLeft className="text-xl" style={{ color: 'oklch(0.9 0.05 265)' }} />
          )}
        </button>

        <Link 
          to="/" 
          className="flex items-center p-3 rounded-lg backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-all border border-white/20 shadow-lg shadow-indigo-500/10 overflow-hidden"
          style={{ color: 'oklch(0.95 0.02 265)' }}
        >
          <FiHome className="min-w-[24px]" style={{ color: 'oklch(0.9 0.05 265)' }} />
          <span className={`ml-3 whitespace-nowrap transition-all duration-300 ${recolhido && !hover ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
            Dashboard
          </span>
        </Link>
        
        <Link 
          to="/gerenciar-estabelecimento" 
          className="flex items-center p-3 rounded-lg backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-all border border-white/20 shadow-lg shadow-indigo-500/10 overflow-hidden"
          style={{ color: 'oklch(0.95 0.02 265)' }}
        >
          <FiMapPin className="min-w-[24px]" style={{ color: 'oklch(0.9 0.05 265)' }} />
          <span className={`ml-3 whitespace-nowrap transition-all duration-300 ${recolhido && !hover ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
            Estabelecimentos
          </span>
        </Link>
        
        <Link 
          to="/gerenciar-produtos" 
          className="flex items-center p-3 rounded-lg backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-all border border-white/20 shadow-lg shadow-indigo-500/10 overflow-hidden"
          style={{ color: 'oklch(0.95 0.02 265)' }}
        >
          <FiShoppingBag className="min-w-[24px]" style={{ color: 'oklch(0.9 0.05 265)' }} />
          <span className={`ml-3 whitespace-nowrap transition-all duration-300 ${recolhido && !hover ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
            Produtos
          </span>
        </Link>
        
        <Link 
          to="/gerenciar-vendas" 
          className="flex items-center p-3 rounded-lg backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-all border border-white/20 shadow-lg shadow-indigo-500/10 overflow-hidden"
          style={{ color: 'oklch(0.95 0.02 265)' }}
        >
          <FiDollarSign className="min-w-[24px]" style={{ color: 'oklch(0.9 0.05 265)' }} />
          <span className={`ml-3 whitespace-nowrap transition-all duration-300 ${recolhido && !hover ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
            Vendas
          </span>
        </Link>
      </div>
    </div>
  );
};

export default MenuLateral;