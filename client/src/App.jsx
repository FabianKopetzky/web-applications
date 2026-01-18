import {useTranslation} from 'react-i18next'
import './App.css'
import {LANGUAGE_STORAGE} from './main';
import {Button, Layout, Menu} from 'antd';
import {CheckCircleOutlined, TeamOutlined, CalendarOutlined} from "@ant-design/icons";

const {Header, Content, Footer} = Layout;

function App() {

    const {t, i18n} = useTranslation();

    function changeLanguage() {
        i18n.changeLanguage(i18n.language === 'en' ? 'de' : 'en');
        localStorage.setItem(LANGUAGE_STORAGE, JSON.stringify(i18n.language));
    }

    return (
        <>
            <div
                className="min-h-[70vh] flex items-center justify-center px-6">
                <div className="max-w-3xl text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                        Keep your household tasks
                        <span className="text-blue-600"> perfectly in sync</span>
                    </h1>


                    <p className="text-lg text-slate-600 mb-8">
                        ToDue helps households stay organized by tracking recurring tasks,
                        due dates, and responsibilities — so nothing gets forgotten.
                    </p>


                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                        <Button type="primary" size="large">
                            Get Started
                        </Button>
                        <Button size="large">View Demo</Button>
                    </div>


                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
                        <Feature
                            icon={<TeamOutlined/>}
                            title="Households"
                            description="Create households and manage tasks together with ease."
                        />
                        <Feature
                            icon={<CalendarOutlined/>}
                            title="Smart Scheduling"
                            description="Set custom intervals and always know what’s due next."
                        />
                        <Feature
                            icon={<CheckCircleOutlined/>}
                            title="Clear Ownership"
                            description="Assign tasks so everyone knows what they’re responsible for."
                        />
                    </div>
                </div>
            </div>
        </>
    )
}


function Feature({icon, title, description}) {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="text-blue-600 text-2xl mb-2">{icon}</div>
            <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
            <p className="text-sm text-slate-600">{description}</p>
        </div>
    );
}

export default App
