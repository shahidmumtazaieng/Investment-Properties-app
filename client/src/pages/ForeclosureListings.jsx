import React, { useState, useEffect } from 'react';
import { List, Card, Typography, Tag, Button, Spin, Alert, Row, Col, Input, Select, Pagination } from 'antd';
import { CalendarOutlined, BankOutlined, DollarCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const ForeclosureListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredListings, setFilteredListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [countyFilter, setCountyFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalListings, setTotalListings] = useState(0);

  useEffect(() => {
    fetchForeclosureListings();
  }, []);

  useEffect(() => {
    filterListings();
  }, [listings, searchTerm, countyFilter]);

  const fetchForeclosureListings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/foreclosure-listings');
      if (!response.ok) {
        throw new Error('Failed to fetch foreclosure listings');
      }
      const data = await response.json();
      setListings(data);
      setTotalListings(data.length);
      setFilteredListings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterListings = () => {
    let result = listings;
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(listing =>
        listing.address.toLowerCase().includes(term) ||
        listing.propertyType.toLowerCase().includes(term) ||
        listing.county.toLowerCase().includes(term)
      );
    }
    
    // Apply county filter
    if (countyFilter !== 'all') {
      result = result.filter(listing => listing.county === countyFilter);
    }
    
    setFilteredListings(result);
    setTotalListings(result.length);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleCountyChange = (value) => {
    setCountyFilter(value);
  };

  const getUniqueCounties = () => {
    const counties = listings.map(p => p.county);
    return [...new Set(counties)].filter(Boolean);
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  // Get current page listings
  const getCurrentPageListings = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredListings.slice(startIndex, endIndex);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p>Loading foreclosure listings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Error"
          description={`Failed to load foreclosure listings: ${error}`}
          type="error"
          showIcon
        />
        <Button 
          type="primary" 
          onClick={fetchForeclosureListings} 
          style={{ marginTop: '16px' }}
        >
          Retry
        </Button>
      </div>
    );
  }

  const currentPageListings = getCurrentPageListings();

  return (
    <div>
      <Title level={2}>
        <BankOutlined style={{ marginRight: '8px' }} />
        Foreclosure Listings
      </Title>
      <p>Upcoming foreclosure auctions in NYC and surrounding areas</p>
      
      <div style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <Input
              placeholder="Search by address, property type, or county"
              prefix={<BankOutlined />}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} md={12}>
            <Select
              style={{ width: '100%' }}
              placeholder="Filter by county"
              onChange={handleCountyChange}
              allowClear
              defaultValue="all"
            >
              <Option value="all">All Counties</Option>
              {getUniqueCounties().map(county => (
                <Option key={county} value={county}>{county}</Option>
              ))}
            </Select>
          </Col>
        </Row>
      </div>

      {currentPageListings.length === 0 ? (
        <Alert
          message="No Foreclosure Listings Found"
          description="Try adjusting your search or filter criteria"
          type="info"
          showIcon
        />
      ) : (
        <>
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 1,
              md: 2,
              lg: 2,
              xl: 3,
              xxl: 3,
            }}
            dataSource={currentPageListings}
            renderItem={listing => (
              <List.Item>
                <Card
                  hoverable
                  title={
                    <div>
                      <Text strong>{listing.address}</Text>
                      <div style={{ marginTop: '4px' }}>
                        <Tag>{listing.county}</Tag>
                        <Tag>{listing.propertyType}</Tag>
                      </div>
                    </div>
                  }
                >
                  <div style={{ marginBottom: '12px' }}>
                    <Text type="secondary">
                      <CalendarOutlined style={{ marginRight: '4px' }} />
                      Auction Date: {listing.auctionDate ? new Date(listing.auctionDate).toLocaleDateString() : 'TBD'}
                    </Text>
                  </div>
                  
                  <div style={{ marginBottom: '12px' }}>
                    <Text>
                      <DollarCircleOutlined style={{ marginRight: '4px' }} />
                      Starting Bid: {listing.startingBid ? `$${listing.startingBid.toLocaleString()}` : 'TBD'}
                    </Text>
                  </div>
                  
                  {listing.assessedValue && (
                    <div style={{ marginBottom: '12px' }}>
                      <Text>
                        Assessed Value: ${listing.assessedValue.toLocaleString()}
                      </Text>
                    </div>
                  )}
                  
                  <div style={{ marginBottom: '12px' }}>
                    {listing.beds && <Tag>{listing.beds} beds</Tag>}
                    {listing.baths && <Tag>{listing.baths} baths</Tag>}
                    {listing.sqft && <Tag>{listing.sqft} sqft</Tag>}
                  </div>
                  
                  <div style={{ marginBottom: '12px' }}>
                    <Text type="secondary">
                      Status: <Tag color={listing.status === 'upcoming' ? 'blue' : 'green'}>{listing.status}</Tag>
                    </Text>
                  </div>
                  
                  <Button type="primary" block>View Details</Button>
                </Card>
              </List.Item>
            )}
          />
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalListings}
              onChange={handlePageChange}
              showSizeChanger
              showQuickJumper
              showTotal={(total) => `Total ${total} listings`}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ForeclosureListings;