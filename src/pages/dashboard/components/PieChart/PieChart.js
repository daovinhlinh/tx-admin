import { Grid, Typography } from '@material-ui/core'
import { useTheme } from '@material-ui/styles'
import React from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import Dot from '../../../../components/Sidebar/components/Dot'
import Widget from '../../../../components/Widget/Widget'
import useStyles from './styles'

const UserPieChart = ({ data }) => {
  var classes = useStyles();
  var theme = useTheme();

  return (
    <Widget title="Revenue Breakdown" upperTitle className={classes.card}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <ResponsiveContainer width="100%" height={144}>
            <PieChart>
              <Pie
                data={data}
                innerRadius={30}
                outerRadius={40}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={theme.palette[entry.color].main}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={6}>
          <div className={classes.pieChartLegendWrapper}>
            {data.map(({ name, value, color }, index) => (
              <div key={color} className={classes.legendItemContainer}>
                <Dot color={color} />
                <Typography style={{ whiteSpace: "nowrap", fontSize: 12 }} >
                  &nbsp;{name}&nbsp;
                </Typography>
                <Typography color="text" colorBrightness="secondary">
                  &nbsp;{value}
                </Typography>
              </div>
            ))}
          </div>
        </Grid>
      </Grid>
    </Widget>
  )
}

export default UserPieChart