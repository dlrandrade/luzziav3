
import React, { useState, useMemo, useEffect } from 'react';
import type { User, Agent, ApiSetting, WebhookEvent } from '../../types';
import { Role } from '../../types';
import MainLayout from '../layout/MainLayout';
import ProfileDropdown from '../common/ProfileDropdown';
import { AVAILABLE_ICONS, MOCK_WEBHOOK_EVENTS } from '../../constants';
// No longer importing apiService
// import * as api from '../../services/apiService';

interface AdminPageProps {
  user: User;
  onLogout: () => void;
  onNavigate: (view: 'chat' | 'admin') => void;
  agents: Agent[];
  setAgents: React.Dispatch<React.SetStateAction<Agent[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  apiSettings: ApiSetting[];
  setApiSettings: React.Dispatch<React.SetStateAction<ApiSetting[]>>;
  logoUrl: string | null;
  setLogoUrl: React.Dispatch<React.SetStateAction<string | null>>;
}

type AdminTab = 'agents' | 'apis' | 'users' | 'webhook' | 'branding';

// --- Reusable Admin UI Components ---

const AdminCard: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={`bg-white p-6 rounded-xl border border-slate-200 ${className}`}>
    {children}
  </div>
);

const AdminButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & {variant?: 'primary' | 'danger' | 'secondary'}> = ({ children, className, variant='primary', ...props }) => {
    const baseClasses = "px-4 py-2 text-sm rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
    const variantClasses = {
        primary: 'bg-slate-900 text-white hover:bg-slate-700',
        danger: 'bg-red-600 text-white hover:bg-red-700',
        secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    }
    return <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>{children}</button>
}

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & {label: string}> = ({ label, ...props}) => (
    <div>
        <label className="block text-sm font-medium text-slate-600 mb-1.5">{label}</label>
        <input className="w-full bg-slate-100 border border-slate-200 rounded-md p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-800 placeholder:text-slate-400" {...props} />
    </div>
);

const TextareaField: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & {label: string}> = ({ label, ...props}) => (
    <div>
        <label className="block text-sm font-medium text-slate-600 mb-1.5">{label}</label>
        <textarea className="w-full bg-slate-100 border border-slate-200 rounded-md p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-800 resize-y placeholder:text-slate-400" {...props} />
    </div>
);

const Modal: React.FC<{isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode}> = ({isOpen, onClose, title, children}) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in-up" style={{ animationDuration: '0.2s' }} onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg border border-slate-200" onClick={e => e.stopPropagation()}>
                <header className="flex justify-between items-center p-4 border-b border-slate-200">
                    <h3 className="text-xl font-bold text-slate-800">{title}</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800"><i className="ph-bold ph-x text-2xl"></i></button>
                </header>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};

const ConfirmationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}> = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm border border-slate-200 p-6 text-center">
                 <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <i className="ph-bold ph-warning text-red-500 text-3xl"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-800">{title}</h3>
                <p className="text-slate-600 my-2">{message}</p>
                <div className="flex justify-center gap-4 mt-6">
                    <AdminButton variant="secondary" onClick={onClose}>Cancelar</AdminButton>
                    <AdminButton variant="danger" onClick={onConfirm}>Confirmar</AdminButton>
                </div>
            </div>
        </div>
    );
};

const IconPicker: React.FC<{
    selectedIcon: string;
    onSelect: (iconClass: string) => void;
}> = ({ selectedIcon, onSelect }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Ícone</label>
            <div className="grid grid-cols-8 gap-2 bg-slate-100 p-2 rounded-md border border-slate-200 max-h-32 overflow-y-auto">
                {AVAILABLE_ICONS.map(iconClass => (
                    <button
                        key={iconClass}
                        type="button"
                        onClick={() => onSelect(iconClass)}
                        className={`flex items-center justify-center text-2xl p-2 rounded-md transition-colors ${selectedIcon === iconClass ? 'bg-slate-900 text-white' : 'hover:bg-slate-200 text-slate-600'}`}
                    >
                        <i className={iconClass}></i>
                    </button>
                ))}
            </div>
        </div>
    )
}


// --- Main Admin Page Component ---

const AdminPage: React.FC<AdminPageProps> = (props) => {
  const { user, onLogout, onNavigate, agents, setAgents, users, setUsers, apiSettings, setApiSettings, logoUrl, setLogoUrl } = props;
  const [activeTab, setActiveTab] = useState<AdminTab>('agents');
  
  const [confirmState, setConfirmState] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  const requestConfirmation = (title: string, message: string, onConfirm: () => void) => {
    setConfirmState({ isOpen: true, title, message, onConfirm });
  };
  
  const closeConfirmation = () => {
    setConfirmState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  }

  // --- Tab Content Components ---

  const AgentsManagementTab = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAgent, setEditingAgent] = useState<Partial<Agent> | null>(null);

    const openModal = (agent?: Agent) => {
        setEditingAgent(agent || { name: '', description: '', systemPrompt: '', icon: AVAILABLE_ICONS[0] });
        setIsModalOpen(true);
    };

    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingAgent || !editingAgent.name) return;
        
        if (editingAgent.id) {
            setAgents(prev => prev.map(a => a.id === editingAgent!.id ? (editingAgent as Agent) : a));
        } else {
            const newAgent: Agent = { ...editingAgent, id: `agent-local-${Date.now()}` } as Agent;
            setAgents(prev => [...prev, newAgent]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
        requestConfirmation(
            "Deletar Agente?",
            "Esta ação não pode ser desfeita.",
            () => {
                setAgents(prev => prev.filter(a => a.id !== id));
                closeConfirmation();
            }
        );
    };

    return (
      <AdminCard>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800">Gerenciar Agentes</h3>
          <AdminButton onClick={() => openModal()}><i className="ph ph-plus"></i> Novo Agente</AdminButton>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-slate-700">
            <thead className="text-sm text-slate-500 uppercase tracking-wider">
              <tr className="border-b border-slate-200">
                <th className="p-3 font-semibold">Nome</th>
                <th className="p-3 font-semibold">Descrição</th>
                <th className="p-3 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {agents.map(agent => (
                <tr key={agent.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="p-3 font-medium text-slate-800 flex items-center gap-3"><i className={`${agent.icon} text-slate-600 text-xl`}></i> {agent.name}</td>
                  <td className="p-3 text-slate-600">{agent.description}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => openModal(agent)} className="text-slate-500 hover:text-slate-900 p-1" aria-label="Edit agent"><i className="ph ph-pencil-simple text-lg"></i></button>
                    <button onClick={() => handleDelete(agent.id)} className="text-slate-500 hover:text-red-600 p-1 ml-2" aria-label="Delete agent"><i className="ph ph-trash text-lg"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingAgent?.id ? 'Editar Agente' : 'Novo Agente'}>
            <form onSubmit={handleSave} className="space-y-4">
                <InputField label="Nome do Agente" value={editingAgent?.name} onChange={e => setEditingAgent({...editingAgent, name: e.target.value})} required />
                <InputField label="Descrição" value={editingAgent?.description} onChange={e => setEditingAgent({...editingAgent, description: e.target.value})} required />
                <TextareaField label="Prompt do Sistema" value={editingAgent?.systemPrompt} onChange={e => setEditingAgent({...editingAgent, systemPrompt: e.target.value})} rows={5} required />
                <IconPicker selectedIcon={editingAgent?.icon || ''} onSelect={icon => setEditingAgent({...editingAgent, icon})} />
                <div className="flex justify-end gap-3 pt-4">
                    <AdminButton type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</AdminButton>
                    <AdminButton type="submit">Salvar</AdminButton>
                </div>
            </form>
        </Modal>
      </AdminCard>
    );
  };
  
  const ApiManagementTab = () => {
      return (
        <AdminCard>
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">Configurações de API</h3>
             </div>
             <p className="text-slate-600">A chave da API do Google Gemini agora é gerenciada por meio de variáveis de ambiente do sistema (`process.env.API_KEY`) por motivos de segurança e não é mais configurável por meio desta interface.</p>
             <table className="w-full text-left text-slate-700 mt-4">
                <thead className="text-sm text-slate-500 uppercase tracking-wider">
                  <tr className="border-b border-slate-200">
                    <th className="p-3 font-semibold">Serviço</th>
                    <th className="p-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="p-3 font-medium text-slate-800">Google Gemini</td>
                      <td className="p-3 text-slate-600 font-mono">
                        {process.env.API_KEY ? 
                           <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-green-100 text-green-800">CONFIGURADA</span>
                           : <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-yellow-100 text-yellow-800">NÃO CONFIGURADA</span>
                        }
                        </td>
                    </tr>
                </tbody>
             </table>
        </AdminCard>
    );
  };
  
  const UsersManagementTab = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<Partial<User>>({});

    const openModal = () => {
        setEditingUser({ name: '', email: '', role: Role.USER });
        setIsModalOpen(true);
    }
    
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser.name || !editingUser.email) return;

        const newUser: User = {
            id: `user-local-${Date.now()}`,
            name: editingUser.name,
            email: editingUser.email,
            role: editingUser.role || Role.USER,
            avatar: `https://i.pravatar.cc/150?u=${editingUser.email}`
        };

        setUsers(prev => [...prev, newUser]);
        setIsModalOpen(false);
    }

    const handleRoleChange = (userId: string, newRole: Role) => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    };

    const handleDelete = (userId: string) => {
        requestConfirmation(
            "Deletar Usuário?",
            "Esta ação removerá permanentemente o usuário e seu acesso.",
            () => {
                setUsers(prev => prev.filter(u => u.id !== userId));
                closeConfirmation();
            }
        );
    };

    return (
        <AdminCard>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">Gerenciar Usuários</h3>
                <AdminButton onClick={openModal}><i className="ph ph-user-plus"></i> Novo Usuário</AdminButton>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-sm text-slate-500 uppercase tracking-wider">
                  <tr className="border-b border-slate-200">
                    <th className="p-3 font-semibold">Usuário</th>
                    <th className="p-3 font-semibold">Email</th>
                    <th className="p-3 font-semibold">Role</th>
                    <th className="p-3 font-semibold text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id} className="border-b border-slate-200 hover:bg-slate-50">
                            <td className="p-3">
                                <div className="flex items-center gap-3">
                                    <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full" />
                                    <span className="font-medium text-slate-800">{u.name}</span>
                                </div>
                            </td>
                            <td className="p-3 text-slate-600">{u.email}</td>
                            <td className="p-3">
                                <select 
                                    value={u.role} 
                                    onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
                                    className="bg-slate-100 border border-slate-200 rounded-md p-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-slate-800"
                                >
                                    <option value={Role.USER}>Usuário</option>
                                    <option value={Role.ADMIN}>Admin</option>
                                </select>
                            </td>
                            <td className="p-3 text-right">
                                <button onClick={() => handleDelete(u.id)} className="text-slate-500 hover:text-red-600 p-1 ml-2"><i className="ph ph-trash text-lg"></i></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Usuário">
                <form onSubmit={handleSave} className="space-y-4">
                    <InputField label="Nome Completo" value={editingUser.name || ''} onChange={e => setEditingUser({...editingUser, name: e.target.value})} required/>
                    <InputField label="Email" type="email" value={editingUser.email || ''} onChange={e => setEditingUser({...editingUser, email: e.target.value})} required />
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1.5">Role</label>
                         <select 
                            value={editingUser.role} 
                            onChange={(e) => setEditingUser({...editingUser, role: e.target.value as Role})}
                            className="w-full bg-slate-100 border border-slate-200 rounded-md p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-800"
                        >
                            <option value={Role.USER}>Usuário</option>
                            <option value={Role.ADMIN}>Admin</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <AdminButton type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</AdminButton>
                        <AdminButton type="submit">Adicionar Usuário</AdminButton>
                    </div>
                </form>
            </Modal>
        </AdminCard>
    );
  };
  
  const WebhookManagementTab = () => {
      const [events, setEvents] = useState<WebhookEvent[]>(MOCK_WEBHOOK_EVENTS);
      
      return (
          <AdminCard>
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">Log de Eventos do Webhook (Simulado)</h3>
             </div>
             <div className="space-y-3 max-h-[60vh] overflow-y-auto scrollbar-thin pr-2">
                {events.map(event => (
                    <div key={event.id} className="bg-white p-4 rounded-lg border border-slate-200">
                        <div className="flex justify-between items-start">
                           <div>
                                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${event.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {event.status.toUpperCase()}
                                </span>
                                <p className="text-xs text-slate-500 mt-2">{new Date(event.timestamp).toLocaleString()}</p>
                           </div>
                           <div className="text-right">
                               <p className="font-mono text-sm text-slate-500">ID: {event.id}</p>
                           </div>
                        </div>
                        <div className="mt-3 bg-slate-50 p-3 rounded font-mono text-xs text-slate-600 overflow-x-auto">
                            <pre><code>{JSON.stringify(event.payload, null, 2)}</code></pre>
                        </div>
                    </div>
                ))}
             </div>
          </AdminCard>
      );
  };
  
    const BrandingManagementTab = () => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === "image/png") {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            alert("Por favor, selecione um arquivo PNG.");
        }
    };
    
    return (
      <AdminCard>
        <h3 className="text-xl font-bold text-slate-800 mb-6">Branding</h3>
        <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center border-2 border-slate-200">
                 {logoUrl ? <img src={logoUrl} alt="Current Logo" className="w-full h-full object-cover rounded-full" /> : <i className="ph-bold ph-lightbulb-filament text-slate-400 text-5xl"></i>}
            </div>
            <div>
                <h4 className="font-semibold text-slate-700">Logo da Empresa</h4>
                <p className="text-sm text-slate-500 mb-3">Use um arquivo PNG com fundo transparente.</p>
                <input type="file" accept="image/png" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                <AdminButton onClick={() => fileInputRef.current?.click()}>
                    <i className="ph ph-upload-simple"></i>
                    Upload Logo
                </AdminButton>
            </div>
        </div>
      </AdminCard>
    )
  }

  // --- Sidebar & Main Layout ---

  const AdminTabButton: React.FC<{icon: string; label: string; tabName: AdminTab}> = ({icon, label, tabName}) => (
    <button onClick={() => setActiveTab(tabName)} className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${activeTab === tabName ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'}`}>
      <i className={`${icon} text-2xl ${activeTab === tabName ? 'text-slate-800' : 'text-slate-400'}`}></i>
      <span className="font-semibold">{label}</span>
    </button>
  );

  const AdminSidebar = () => (
    <div className="flex flex-col h-full text-slate-800">
       <div className="p-2 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
               {logoUrl ? <img src={logoUrl} alt="LuzzIA Logo" className="w-full h-full object-cover rounded-full"/> : <i className="ph-bold ph-lightbulb-filament text-white text-lg"></i>}
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tighter">LuzzIA</h1>
          </div>
          <p className="text-sm text-slate-500 uppercase tracking-wider mt-1">Admin Panel</p>
      </div>

      <nav className="flex-grow">
         <ul className="space-y-1">
            <li><AdminTabButton icon="ph-bold ph-brain" label="Agentes" tabName="agents" /></li>
            <li><AdminTabButton icon="ph-bold ph-plugs-connected" label="APIs" tabName="apis" /></li>
            <li><AdminTabButton icon="ph-bold ph-users-three" label="Usuários" tabName="users" /></li>
            <li><AdminTabButton icon="ph-bold ph-git-merge" label="Webhook" tabName="webhook" /></li>
            <li><AdminTabButton icon="ph-bold ph-paint-roller" label="Branding" tabName="branding" /></li>
         </ul>
      </nav>

       <div className="mt-auto flex-shrink-0 border-t border-slate-200 pt-4">
         <ProfileDropdown user={user} onLogout={onLogout} onNavigate={onNavigate} currentView="admin" />
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
        case 'agents':
            return <AgentsManagementTab />;
        case 'apis':
            return <ApiManagementTab />;
        case 'users':
            return <UsersManagementTab />;
        case 'webhook':
            return <WebhookManagementTab />;
        case 'branding':
            return <BrandingManagementTab />;
        default:
            return <div>Selecione uma aba</div>;
    }
  };
  
  const PageHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-4xl font-bold mb-8 text-slate-900 capitalize tracking-tight">
      {children}
    </h2>
  );

  return (
    <MainLayout
      leftSidebar={<AdminSidebar />}
      mainContent={
        <div className="h-full overflow-y-auto scrollbar-thin">
            <ConfirmationModal 
                isOpen={confirmState.isOpen}
                onClose={closeConfirmation}
                onConfirm={confirmState.onConfirm}
                title={confirmState.title}
                message={confirmState.message}
            />
            <PageHeader>{activeTab.replace('apis', 'APIs')}</PageHeader>
            {renderTabContent()}
        </div>
      }
    />
  );
};

export default AdminPage;
