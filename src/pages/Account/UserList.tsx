import React, { useState, useEffect } from 'react';
import { Skeleton, Row, Col, Card } from 'antd';
import { getSchemas } from '@/services/stats';

export default function Stats() {
  const [loading, setLoading] = useState(true);
  const [schemas, setSchemas] = useState([]);

  useEffect(() => {
    (async () => {
      const schemas = await getSchemas();
      setLoading(false);
      setSchemas(schemas);
    })();
  }, []);

  return (
    <Row type="flex">
      <Skeleton loading={loading} active>
        {schemas.map(schema => (
          <Col span={4}>
            <Card hoverable onClick={() => console.log(schema.title)}>
              {schema.title}
            </Card>
          </Col>
        ))}
      </Skeleton>
    </Row>
  );
}
