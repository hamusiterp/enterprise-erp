import { HomeOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="404"
      subTitle="The page you requested could not be found."
      extra={
        <Button
          type="primary"
          icon={<HomeOutlined />}
          onClick={() => navigate('/dashboard')}
        >
          Return to dashboard
        </Button>
      }
    />
  );
}

export default NotFoundPage;