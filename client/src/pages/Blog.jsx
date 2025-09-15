import React, { useState, useEffect } from 'react';
import { List, Card, Typography, Spin, Alert, Button, Row, Col } from 'antd';
import { CalendarOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/blogs');
      if (!response.ok) {
        throw new Error('Failed to fetch blogs');
      }
      const data = await response.json();
      setBlogs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p>Loading blog posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Error"
          description={`Failed to load blog posts: ${error}`}
          type="error"
          showIcon
        />
        <Button 
          type="primary" 
          onClick={fetchBlogs} 
          style={{ marginTop: '16px' }}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Title level={2}>Investment Blog</Title>
      <Paragraph style={{ fontSize: '16px', marginBottom: '24px' }}>
        Stay updated with the latest real estate investment strategies, market trends, and property insights in NYC.
      </Paragraph>

      {blogs.length === 0 ? (
        <Alert
          message="No Blog Posts"
          description="There are currently no blog posts available. Please check back later."
          type="info"
          showIcon
        />
      ) : (
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 1,
            md: 1,
            lg: 1,
            xl: 1,
            xxl: 1,
          }}
          dataSource={blogs}
          renderItem={blog => (
            <List.Item>
              <Card
                hoverable
                title={
                  <div>
                    <Title level={3} style={{ margin: 0 }}>{blog.title}</Title>
                    <div style={{ marginTop: '8px' }}>
                      <Text type="secondary">
                        <UserOutlined style={{ marginRight: '4px' }} />
                        {blog.author || 'Investor Properties NY'}
                        <span style={{ margin: '0 8px' }}>•</span>
                        <CalendarOutlined style={{ marginRight: '4px' }} />
                        {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : 'Unknown date'}
                      </Text>
                    </div>
                  </div>
                }
              >
                <Paragraph style={{ fontSize: '16px' }}>
                  {blog.excerpt || blog.content?.substring(0, 200) + '...'}
                </Paragraph>
                <Button type="primary" href={`/blog/${blog.slug || blog.id}`}>Read More</Button>
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default Blog;