import React from 'react';
import { Layout, Menu } from 'antd';
import BookTypePage  from './pages/BookTypePage';
import BookPage from './pages/BookPage';

const { Sider, Content } = Layout;

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = React.useState('bookType');

  return (
    <Layout>
      <Sider>
        <Menu
          mode="inline"
          defaultSelectedKeys={['bookType']}
          onClick={(e) => setCurrentTab(e.key)}
        >
          <Menu.Item key="bookType">Book Type</Menu.Item>
          <Menu.Item key="book">Book</Menu.Item>
        </Menu>
      </Sider>
      <Content>
        {currentTab === 'bookType' ? <BookTypePage /> : <BookPage />}
      </Content>
    </Layout>
  );
};

export default App;




















































// import React from 'react';
// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
