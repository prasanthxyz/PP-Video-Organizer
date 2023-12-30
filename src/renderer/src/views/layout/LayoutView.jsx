import { ArrowLeftOutlined, BulbFilled, BulbOutlined, SyncOutlined } from '@ant-design/icons'
import { Button, ConfigProvider, Image, Layout, Menu, Space, Typography, theme } from 'antd'
import { Link, Outlet } from 'react-router-dom'
import darkIcon from '../../assets/darkicon.png'
import lightIcon from '../../assets/lighticon.png'

const { defaultAlgorithm, darkAlgorithm } = theme
const { Header, Content } = Layout
const { Title } = Typography

const LayoutView = ({
  isDarkMode,
  PAGES,
  activeNav,
  toggleDarkMode,
  navigate,
  refreshCombinations
}) => (
  <ConfigProvider
    theme={{
      algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm
    }}
  >
    <Layout style={{ minHeight: '100vh', minWidth: '100vw', padding: '0.4rem' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'inherit'
        }}
      >
        <Space>
          <Image src={isDarkMode ? darkIcon : lightIcon} width={30} height={30} preview={false} />
          <Title style={{ margin: 0, textWrap: 'nowrap' }} level={4}>
            PVORG
          </Title>
        </Space>
        <Menu
          mode="horizontal"
          selectedKeys={[activeNav]}
          items={PAGES.map((page) => ({
            label: <Link to={page.location}>{page.text}</Link>,
            key: page.text
          }))}
          style={{ backgroundColor: 'inherit' }}
        />
        <Space>
          <Button onClick={refreshCombinations}>
            <SyncOutlined />
          </Button>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeftOutlined />
          </Button>
          <Button onClick={toggleDarkMode}>{isDarkMode ? <BulbOutlined /> : <BulbFilled />}</Button>
        </Space>
      </Header>
      <Content>
        <Outlet />
      </Content>
    </Layout>
  </ConfigProvider>
)

export default LayoutView
