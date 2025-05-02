// frontend/pages/dashboard.js
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PrivateRoute from '../components/auth/PrivateRoute';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import BarChartIcon from '@mui/icons-material/BarChart';
import companyService from '../services/companyService';
import userService from '../services/userService';
import fourMService from '../services/fourMService';
import yamazumiService from '../services/yamazumiService';

function DashboardContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    companies: 0,
    users: 0,
    fourMProjects: 0,
    yamazumiProjects: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      if (user.role === 'superadmin') {
        const [companies, users, fourM, yamazumi] = await Promise.all([
          companyService.getAll(),
          userService.getAll(),
          fourMService.getAll(),
          yamazumiService.getAll(),
        ]);
        setStats({
          companies: companies.data.count,
          users: users.data.count,
          fourMProjects: fourM.data.count,
          yamazumiProjects: yamazumi.data.count,
        });
      } else {
        const [users, fourM, yamazumi] = await Promise.all([
          userService.getAll({ companyId: user.companyId }),
          fourMService.getAll({ companyId: user.companyId }),
          yamazumiService.getAll({ companyId: user.companyId }),
        ]);
        setStats({
          companies: 1,
          users: users.data.count,
          fourMProjects: fourM.data.count,
          yamazumiProjects: yamazumi.data.count,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const cards = [
    {
      title: 'Companies',
      value: stats.companies,
      icon: <BusinessIcon fontSize="large" />,
      color: '#1976d2',
      show: user?.role === 'superadmin',
    },
    {
      title: 'Users',
      value: stats.users,
      icon: <PeopleIcon fontSize="large" />,
      color: '#388e3c',
      show: user?.role === 'superadmin' || user?.role === 'admin',
    },
    {
      title: '4M Projects',
      value: stats.fourMProjects,
      icon: <AccountTreeIcon fontSize="large" />,
      color: '#f57c00',
      show: true,
    },
    {
      title: 'Yamazumi Projects',
      value: stats.yamazumiProjects,
      icon: <BarChartIcon fontSize="large" />,
      color: '#7b1fa2',
      show: true,
    },
  ].filter((card) => card.show);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Card>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <div style={{ color: card.color }}>{card.icon}</div>
                  </Grid>
                  <Grid item xs>
                    <Typography color="textSecondary" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography variant="h5">{card.value}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default function Dashboard() {
  return (
    <PrivateRoute>
      <DashboardContent />
    </PrivateRoute>
  );
}