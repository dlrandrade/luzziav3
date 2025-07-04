
import React from 'react';
import type { User } from '../../types';
import { Role } from '../../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
  logoUrl: string | null;
  allUsers: User[];
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, logoUrl, allUsers }) => {

  const handleLogin = (role: Role) => {
    // In a real app, this would be a form with username/password.
    // Here, we just find the first available user with the chosen role.
    const userToLogin = allUsers.find(u => u.role === role);
    if(userToLogin) {
        onLogin(userToLogin);
    } else {
        alert(`No ${role} user found in the database to log in with.`);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-sm mx-auto text-center">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center">
              {logoUrl ? <img src={logoUrl} alt="LuzzIA Logo" className="w-full h-full object-cover rounded-full" /> : <i className="ph-bold ph-lightbulb-filament text-white text-2xl"></i>}
            </div>
          </div>
           <h1 className="text-5xl font-bold tracking-tight text-slate-900">
            LuzzIA
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Eu não sou uma IA comum
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3">
            <button
              onClick={() => handleLogin(Role.ADMIN)}
              className="w-full bg-slate-900 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors"
            >
                <i className="ph ph-user-gear"></i>
                Acessar como Admin
            </button>
            <button
              onClick={() => handleLogin(Role.USER)}
              className="w-full bg-slate-200 text-slate-800 font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-300 transition-colors"
            >
               <i className="ph ph-user"></i>
              Acessar como Usuário
            </button>
          </div>
      </div>
    </div>
  );
};

export default LoginPage;
