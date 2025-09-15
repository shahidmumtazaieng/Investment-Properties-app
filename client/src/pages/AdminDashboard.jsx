import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Card, Table, Button, Row, Col, Tag, Space, Tabs, message, Spin, Alert } from 'antd';
import { LogoutOutlined, DashboardOutlined, UsergroupAddOutlined, HomeOutlined, UserOutlined, FileTextOutlined, BankOutlined, BarChartOutlined } from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { TabPane } = Tabs;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('dashboard');
  const [partnersData, setPartnersData] = useState([]);
  const [propertiesData, setPropertiesData] = useState([]);
  const [leadsData, setLeadsData] = useState([]);
  const [offersData, setOffersData] = useState([]);
  const [investorsData, setInvestorsData] = useState([]);
  const [foreclosureData, setForeclosureData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  useEffect(() => {
    // Set the selected menu item based on the current route
    const path = location.pathname;
    if (path.includes('/control-panel/partners')) {
      setSelectedKey('partners');
    } else if (path.includes('/control-panel/properties')) {
      setSelectedKey('properties');
    } else if (path.includes('/control-panel/leads')) {
      setSelectedKey('leads');
    } else if (path.includes('/control-panel/offers')) {
      setSelectedKey('offers');
    } else if (path.includes('/control-panel/investors')) {
      setSelectedKey('investors');
    } else if (path.includes('/control-panel/foreclosures')) {
      setSelectedKey('foreclosures');
    } else {
      setSelectedKey('dashboard');
    }
  }, [location]);

  const checkAuthAndFetchData = async () => {
    try {
      // Check if user is authenticated
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/control-panel/login');
        return;
      }

      // Verify token with backend
      const authResponse = await fetch('/api/admin/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!authResponse.ok) {
        // If not authenticated, redirect to login
        localStorage.removeItem('adminToken');
        navigate('/control-panel/login');
        return;
      }
      
      setAuthChecked(true);
      
      // If authenticated, fetch all data
      await fetchAllData();
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthError('Authentication failed. Please log in again.');
      localStorage.removeItem('adminToken');
      navigate('/control-panel/login');
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch partners
      const partnersRes = await fetch('/api/admin/partners', { headers });
      if (partnersRes.ok) {
        const partners = await partnersRes.json();
        setPartnersData(partners.map(p => ({
          key: p.id,
          name: `${p.firstName} ${p.lastName}`,
          email: p.email,
          company: p.company || 'N/A',
          status: p.approvalStatus,
          createdAt: p.createdAt
        })));
      }

      // Fetch properties
      const propertiesRes = await fetch('/api/admin/properties', { headers });
      if (propertiesRes.ok) {
        const properties = await propertiesRes.json();
        setPropertiesData(properties.map(p => ({
          key: p.id,
          address: p.address,
          neighborhood: p.neighborhood,
          price: `$${p.price?.toLocaleString() || 0}`,
          status: p.status,
          partner: p.partnerId ? 'Partner' : 'Internal'
        })));
      }

      // Fetch leads
      const leadsRes = await fetch('/api/admin/leads', { headers });
      if (leadsRes.ok) {
        const leads = await leadsRes.json();
        setLeadsData(leads.map(l => ({
          key: l.id,
          name: l.name,
          email: l.email,
          type: l.type,
          status: l.status,
          createdAt: l.createdAt
        })));
      }

      // Fetch offers
      const offersRes = await fetch('/api/admin/offers', { headers });
      if (offersRes.ok) {
        const offers = await offersRes.json();
        setOffersData(offers.map(o => ({
          key: o.id,
          property: o.propertyId,
          amount: `$${o.offerAmount?.toLocaleString() || 0}`,
          status: o.status,
          createdAt: o.createdAt
        })));
      }

      // Fetch institutional investors
      const investorsRes = await fetch('/api/admin/institutional-investors', { headers });
      if (investorsRes.ok) {
        const investors = await investorsRes.json();
        setInvestorsData(investors.map(i => ({
          key: i.id,
          name: i.personName,
          institution: i.institutionName,
          email: i.email,
          status: i.status,
          createdAt: i.createdAt
        })));
      }

      // Fetch foreclosure listings
      const foreclosureRes = await fetch('/api/admin/foreclosure-listings', { headers });
      if (foreclosureRes.ok) {
        const foreclosures = await foreclosureRes.json();
        setForeclosureData(foreclosures.map(f => ({
          key: f.id,
          address: f.address,
          county: f.county,
          auctionDate: f.auctionDate,
          startingBid: `$${f.startingBid?.toLocaleString() || 0}`,
          status: f.status
        })));
      }
    } catch (error) {
      message.error('Failed to fetch data');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      // Call the logout API endpoint
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('adminToken');
      navigate('/control-panel/login');
    }
  };

  const columns = {
    partners: [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Email', dataIndex: 'email', key: 'email' },
      { title: 'Company', dataIndex: 'company', key: 'company' },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status) => (
          <Tag color={status === 'approved' ? 'green' : status === 'rejected' ? 'red' : 'blue'}>
            {status.toUpperCase()}
          </Tag>
        )
      },
      { title: 'Created', dataIndex: 'createdAt', key: 'createdAt', render: (date) => new Date(date).toLocaleDateString() }
    ],
    properties: [
      { title: 'Address', dataIndex: 'address', key: 'address' },
      { title: 'Neighborhood', dataIndex: 'neighborhood', key: 'neighborhood' },
      { title: 'Price', dataIndex: 'price', key: 'price' },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status) => <Tag color={status === 'available' ? 'green' : 'red'}>{status}</Tag>
      },
      { title: 'Source', dataIndex: 'partner', key: 'partner' }
    ],
    leads: [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Email', dataIndex: 'email', key: 'email' },
      { title: 'Type', dataIndex: 'type', key: 'type' },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status) => <Tag color={status === 'new' ? 'blue' : status === 'converted' ? 'green' : 'orange'}>{status}</Tag>
      },
      { title: 'Created', dataIndex: 'createdAt', key: 'createdAt', render: (date) => new Date(date).toLocaleDateString() }
    ],
    offers: [
      { title: 'Property ID', dataIndex: 'property', key: 'property' },
      { title: 'Amount', dataIndex: 'amount', key: 'amount' },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status) => <Tag color={status === 'pending' ? 'blue' : status === 'accepted' ? 'green' : 'red'}>{status}</Tag>
      },
      { title: 'Created', dataIndex: 'createdAt', key: 'createdAt', render: (date) => new Date(date).toLocaleDateString() }
    ],
    investors: [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Institution', dataIndex: 'institution', key: 'institution' },
      { title: 'Email', dataIndex: 'email', key: 'email' },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status) => (
          <Tag color={status === 'approved' ? 'green' : status === 'rejected' ? 'red' : 'blue'}>
            {status.toUpperCase()}
          </Tag>
        )
      },
      { title: 'Created', dataIndex: 'createdAt', key: 'createdAt', render: (date) => new Date(date).toLocaleDateString() }
    ],
    foreclosures: [
      { title: 'Address', dataIndex: 'address', key: 'address' },
      { title: 'County', dataIndex: 'county', key: 'county' },
      { title: 'Auction Date', dataIndex: 'auctionDate', key: 'auctionDate', render: (date) => new Date(date).toLocaleDateString() },
      { title: 'Starting Bid', dataIndex: 'startingBid', key: 'startingBid' },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status) => <Tag color={status === 'upcoming' ? 'blue' : 'green'}>{status}</Tag>
      }
    ]
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard'
    },
    {
      key: 'partners',
      icon: <UsergroupAddOutlined />,
      label: 'Partners'
    },
    {
      key: 'properties',
      icon: <HomeOutlined />,
      label: 'Properties'
    },
    {
      key: 'foreclosures',
      icon: <BankOutlined />,
      label: 'Foreclosures'
    },
    {
      key: 'leads',
      icon: <UserOutlined />,
      label: 'Leads'
    },
    {
      key: 'offers',
      icon: <FileTextOutlined />,
      label: 'Offers'
    },
    {
      key: 'investors',
      icon: <BarChartOutlined />,
      label: 'Institutional Investors'
    }
  ];

  const renderContent = () => {
    if (!authChecked) {
      return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <p>Checking authentication...</p>
        </div>
      );
    }

    if (authError) {
      return (
        <Alert
          message="Authentication Error"
          description={authError}
          type="error"
          showIcon
        />
      );
    }

    switch (selectedKey) {
      case 'dashboard':
        return (
          <Card title="Dashboard Overview">
            <Row gutter={16}>
              <Col span={6}>
                <Card>
                  <p>Total Partners</p>
                  <h2>{partnersData.length}</h2>
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <p>Total Properties</p>
                  <h2>{propertiesData.length}</h2>
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <p>Total Leads</p>
                  <h2>{leadsData.length}</h2>
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <p>Total Offers</p>
                  <h2>{offersData.length}</h2>
                </Card>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: '24px' }}>
              <Col span={6}>
                <Card>
                  <p>Institutional Investors</p>
                  <h2>{investorsData.length}</h2>
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <p>Foreclosure Listings</p>
                  <h2>{foreclosureData.length}</h2>
                </Card>
              </Col>
            </Row>
          </Card>
        );
      case 'partners':
        return (
          <Card title="Partners Management">
            <Table
              columns={columns.partners}
              dataSource={partnersData}
              loading={loading}
              rowKey="key"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        );
      case 'properties':
        return (
          <Card title="Properties Management">
            <Table
              columns={columns.properties}
              dataSource={propertiesData}
              loading={loading}
              rowKey="key"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        );
      case 'foreclosures':
        return (
          <Card title="Foreclosure Listings Management">
            <Table
              columns={columns.foreclosures}
              dataSource={foreclosureData}
              loading={loading}
              rowKey="key"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        );
      case 'leads':
        return (
          <Card title="Leads Management">
            <Table
              columns={columns.leads}
              dataSource={leadsData}
              loading={loading}
              rowKey="key"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        );
      case 'offers':
        return (
          <Card title="Offers Management">
            <Table
              columns={columns.offers}
              dataSource={offersData}
              loading={loading}
              rowKey="key"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        );
      case 'investors':
        return (
          <Card title="Institutional Investors Management">
            <Table
              columns={columns.investors}
              dataSource={investorsData}
              loading={loading}
              rowKey="key"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        );
      default:
        return (
          <Card title="Dashboard">
            <p>Welcome to the Admin Dashboard</p>
          </Card>
        );
    }
  };

  // Redirect to login if not authenticated
  if (!localStorage.getItem('adminToken') && !authChecked) {
    navigate('/control-panel/login');
    return null;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="logo" style={{ height: 32, margin: 16, background: 'rgba(255,255,255,.2)', textAlign: 'center', color: 'white', lineHeight: '32px' }}>
          Admin Panel
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onSelect={({ key }) => setSelectedKey(key)}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ marginLeft: 16, fontSize: 16 }}>Welcome, Admin</div>
          <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout} style={{ marginRight: 16 }}>
            Logout
          </Button>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;