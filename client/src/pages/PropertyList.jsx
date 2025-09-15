import React, { useState, useEffect } from 'react';
import { List, Card, Typography, Tag, Button, Spin, Alert, Row, Col, Input, Select, Pagination } from 'antd';
import { SearchOutlined, HomeOutlined, DollarCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [boroughFilter, setBoroughFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalProperties, setTotalProperties] = useState(0);

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    filterProperties();
  }, [properties, searchTerm, boroughFilter]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/properties');
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      const data = await response.json();
      setProperties(data);
      setTotalProperties(data.length);
      setFilteredProperties(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterProperties = () => {
    let result = properties;
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(property =>
        property.address.toLowerCase().includes(term) ||
        property.neighborhood.toLowerCase().includes(term) ||
        property.propertyType.toLowerCase().includes(term)
      );
    }
    
    // Apply borough filter
    if (boroughFilter !== 'all') {
      result = result.filter(property => property.borough === boroughFilter);
    }
    
    setFilteredProperties(result);
    setTotalProperties(result.length);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleBoroughChange = (value) => {
    setBoroughFilter(value);
  };

  const getUniqueBoroughs = () => {
    const boroughs = properties.map(p => p.borough);
    return [...new Set(boroughs)].filter(Boolean);
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  // Get current page properties
  const getCurrentPageProperties = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredProperties.slice(startIndex, endIndex);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p>Loading properties...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Error"
          description={`Failed to load properties: ${error}`}
          type="error"
          showIcon
        />
        <Button 
          type="primary" 
          onClick={fetchProperties} 
          style={{ marginTop: '16px' }}
        >
          Retry
        </Button>
      </div>
    );
  }

  const currentProperties = getCurrentPageProperties();

  return (
    <div>
      <Title level={2}>
        <HomeOutlined style={{ marginRight: '8px' }} />
        Available Properties
      </Title>
      
      <div style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <Input
              placeholder="Search by address, neighborhood, or property type"
              prefix={<SearchOutlined />}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} md={12}>
            <Select
              style={{ width: '100%' }}
              placeholder="Filter by borough"
              onChange={handleBoroughChange}
              allowClear
              defaultValue="all"
            >
              <Option value="all">All Boroughs</Option>
              {getUniqueBoroughs().map(borough => (
                <Option key={borough} value={borough}>{borough}</Option>
              ))}
            </Select>
          </Col>
        </Row>
      </div>

      {currentProperties.length === 0 ? (
        <Alert
          message="No Properties Found"
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
            dataSource={currentProperties}
            renderItem={property => (
              <List.Item>
                <Card
                  hoverable
                  cover={
                    property.images && property.images.length > 0 ? (
                      <img
                        alt={property.address}
                        src={property.images[0]}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ 
                        height: '200px', 
                        backgroundColor: '#f0f2f5', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                      }}>
                        <HomeOutlined style={{ fontSize: '48px', color: '#bfbfbf' }} />
                      </div>
                    )
                  }
                  actions={[
                    <Button type="primary" key="view">View Details</Button>,
                    <Button key="offer">Make Offer</Button>,
                  ]}
                >
                  <Card.Meta
                    title={property.address}
                    description={
                      <div>
                        <Text strong>{property.neighborhood}, {property.borough}</Text>
                        <div style={{ marginTop: '8px' }}>
                          <Text type="success" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                            ${(property.price || 0).toLocaleString()}
                          </Text>
                        </div>
                        <div style={{ marginTop: '8px' }}>
                          <Tag>{property.propertyType}</Tag>
                          {property.beds && <Tag>{property.beds} beds</Tag>}
                          {property.baths && <Tag>{property.baths} baths</Tag>}
                          {property.sqft && <Tag>{property.sqft} sqft</Tag>}
                        </div>
                        {property.arv && (
                          <div style={{ marginTop: '8px' }}>
                            <Text type="secondary">
                              <DollarCircleOutlined /> ARV: ${(property.arv || 0).toLocaleString()}
                            </Text>
                          </div>
                        )}
                        {property.estimatedProfit && (
                          <div style={{ marginTop: '4px' }}>
                            <Text type="success">
                              Estimated Profit: ${(property.estimatedProfit || 0).toLocaleString()}
                            </Text>
                          </div>
                        )}
                      </div>
                    }
                  />
                </Card>
              </List.Item>
            )}
          />
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalProperties}
              onChange={handlePageChange}
              showSizeChanger
              showQuickJumper
              showTotal={(total) => `Total ${total} properties`}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default PropertyList;