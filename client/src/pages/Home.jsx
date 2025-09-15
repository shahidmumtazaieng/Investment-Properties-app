import React from 'react';
import { Layout, Card, Row, Col, Typography, Button } from 'antd';
import { HomeOutlined, HomeFilled, DollarCircleFilled, UsergroupAddOutlined, BankOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Home = () => {
  return (
    <div>
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Title level={2}>Welcome to Investor Properties NY</Title>
        <Paragraph style={{ fontSize: '18px', maxWidth: '800px', margin: '0 auto' }}>
          Your premier platform for NYC wholesale real estate investment opportunities
        </Paragraph>
      </div>

      <Row gutter={[24, 24]} justify="center">
        <Col xs={24} sm={12} lg={6}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HomeFilled style={{ color: '#1890ff' }} />
                <span>Property Listings</span>
              </div>
            }
            bordered={false}
            hoverable
          >
            <Paragraph>
              Browse our extensive collection of wholesale real estate properties in NYC's most promising neighborhoods.
            </Paragraph>
            <Button type="primary" href="/properties">View Properties</Button>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BankOutlined style={{ color: '#ff4d4f' }} />
                <span>Foreclosure Listings</span>
              </div>
            }
            bordered={false}
            hoverable
          >
            <Paragraph>
              Access upcoming foreclosure auctions with detailed property information and bidding opportunities.
            </Paragraph>
            <Button type="primary" href="/foreclosures">View Foreclosures</Button>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarCircleFilled style={{ color: '#52c41a' }} />
                <span>Investment Opportunities</span>
              </div>
            }
            bordered={false}
            hoverable
          >
            <Paragraph>
              Discover high-value investment opportunities with detailed financial analysis and profit projections.
            </Paragraph>
            <Button type="primary" href="/properties">Explore Investments</Button>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UsergroupAddOutlined style={{ color: '#722ed1' }} />
                <span>Join Our Network</span>
              </div>
            }
            bordered={false}
            hoverable
          >
            <Paragraph>
              Become part of our exclusive network of real estate investors and property wholesalers.
            </Paragraph>
            <Button type="primary" href="/join-buyers">Join Now</Button>
          </Card>
        </Col>
      </Row>

      <div style={{ textAlign: 'center', padding: '40px 0', marginTop: '40px' }}>
        <Title level={3}>Why Choose Investor Properties NY?</Title>
        <Row gutter={[24, 24]} justify="center" style={{ marginTop: '24px' }}>
          <Col xs={24} md={8}>
            <Card bordered={false}>
              <Title level={4}>Exclusive Deals</Title>
              <Paragraph>
                Access to off-market properties and exclusive wholesale deals not available to the general public.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card bordered={false}>
              <Title level={4}>Expert Analysis</Title>
              <Paragraph>
                Comprehensive property analysis with ARV, profit projections, and investment recommendations.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card bordered={false}>
              <Title level={4}>Secure Transactions</Title>
              <Paragraph>
                Safe and secure transaction process with legal documentation and escrow services.
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Home;