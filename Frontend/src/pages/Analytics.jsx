import RevenueChart from '../components/RevenueChart'

import {
  revenueData,
  customerGrowthData,
  segmentData,
  purchaseActivity
} from '../data/mockData'

function Analytics () {
  return (
    <div className='page'>
      <div className='page-heading'>
        <div>
          <h2>Analytics</h2>
          <p>Turn customer data into useful business insights.</p>
        </div>
      </div>

      <div className='analytics-page-grid'>
        <section className='card'>
          <div className='card-header'>
            <div>
              <h3>Revenue Growth</h3>
              <p>Last 6 months</p>
            </div>
          </div>

          <RevenueChart data={revenueData} />
        </section>

        <section className='card'>
          <div className='card-header'>
            <div>
              <h3>Customer Growth</h3>
              <p>Total customer base</p>
            </div>
          </div>

          <RevenueChart
            data={customerGrowthData.map(item => ({
              label: item.month,
              value: item.customers
            }))}
          />
        </section>

        <section className='card'>
          <div className='card-header'>
            <div>
              <h3>Segment Distribution</h3>
            </div>
          </div>

          <div className='analytics-segment-list'>
            {segmentData.map((segment, index) => (
              <div key={segment.id} className='analytics-segment-row'>
                <span>{segment.name}</span>

                <div className='progress-track'>
                  <div
                    className='progress-fill'
                    style={{
                      width: `${segment.percentage}%`,
                      '--delay': `${index * 0.08}s`
                    }}
                  />
                </div>

                <strong>{segment.percentage}%</strong>
              </div>
            ))}
          </div>
        </section>

        <section className='card'>
          <div className='card-header'>
            <div>
              <h3>New vs Repeat Customers</h3>
            </div>
          </div>

          <div className='activity-chart analytics-activity'>
            {purchaseActivity.map((item, index) => (
              <div key={item.month} className='activity-column'>
                <div className='activity-bars'>
                  <div
                    className='activity-bar new-bar'
                    style={{
                      height: `${item.newCustomers / 2}px`,
                      '--delay': `${index * 0.08}s`
                    }}
                    title={`New Customers: ${item.newCustomers}`}
                  />

                  <div
                    className='activity-bar repeat-bar'
                    style={{
                      height: `${item.repeatCustomers / 2}px`,
                      '--delay': `${index * 0.08 + 0.04}s`
                    }}
                    title={`Repeat Customers: ${item.repeatCustomers}`}
                  />
                </div>

                <span>{item.month}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Analytics
