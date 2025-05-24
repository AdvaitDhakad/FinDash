from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from data_fetcher import SimpleMarketFetcher

app = Flask(__name__)
CORS(app)

data_fetcher = SimpleMarketFetcher()

@app.route('/')
def home():
    return jsonify({
        'message': 'Financial Data API',
        'version': '1.0.0',
        'endpoints': {
            '/financial-data': 'POST - Calculate net worth from assets',
            '/stock/<symbol>': 'GET - Fetch specific stock data',
            '/gold': 'GET - Fetch current gold prices',
            '/property/<location>': 'GET - Fetch property rates for location'
        },
        'parameters': {
            'symbol': 'Stock symbol',
            'scheme': 'Mutual fund scheme name',
            'purity': 'Gold purity (e.g., 91.6)',
            'weight': 'Weight in grams'
        }
    })

@app.route('/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC'),
        'service': 'Financial Data API'
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'error': 'Endpoint not found'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'error': 'Internal server error'
    }), 500

@app.route('/financial-data', methods=['POST'])
def calculate_net_worth():
    try:
        data = request.json
        total_worth_stocks = 0
        total_worth_mf = 0
        total_worth_gold = 0
        stocks_breakdown = []  # New list to store stock details

        if 'stocks' in data:
            for stock in data['stocks']:
                if stock['company'] and stock['quantity'] and stock['ticker']:
                    stock_data = data_fetcher.get_stock_data_change(
                        stock['ticker'],
                        stock.get('purchaseDate', '2024-01-01')
                    )
                    if 'error' not in stock_data:
                        stock_value = stock_data['current_price'] * stock['quantity']
                        total_worth_stocks += stock_value
                        # Store detailed stock information
                        stocks_breakdown.append({
                            'symbol': stock_data['symbol'],
                            'exchange_symbol': stock_data['exchange_symbol'],
                            'quantity': stock['quantity'],
                            'current_price': stock_data['current_price'],
                            'total_value': round(stock_value, 2),
                            'percent_change': stock_data['percent_change'],
                            'trend': stock_data['trend'],
                            'price_history': stock_data['price_history']
                        })

        if 'mutualFunds' in data:
            mf_breakdown = []  # New list for mutual fund details
            for fund in data['mutualFunds']:
                if fund['scheme'] and fund['quantity']:
                    fund_data = data_fetcher.get_mutual_fund_data(fund['scheme'])
                    if fund_data and 'nav' in fund_data:
                        fund_value = float(fund_data['nav']) * fund['quantity']
                        total_worth_mf += fund_value
                        # Store detailed fund information
                        mf_breakdown.append({
                            'scheme_name': fund_data['scheme_name'],
                            'scheme_code': fund_data['scheme_code'],
                            'nav': float(fund_data['nav']),
                            'quantity': fund['quantity'],
                            'total_value': round(fund_value, 2),
                            'last_updated': fund_data['date'],
                            'source': fund_data['source']
                        })

        if 'gold' in data and data['gold']['weight']:
            gold = data['gold']
            purity_map = {
                '24K': 100,
                '22K': 91.6,
                '18K': 75,
                '14K': 58.5
            }
            purity_value = purity_map.get(gold['quality'], 100)
            gold_data = data_fetcher.get_gold_price_value(purity_value, gold['weight'])
            if gold_data and 'total_value_inr' in gold_data:
                total_worth_gold += gold_data['total_value_inr']

        total_worth = total_worth_stocks + total_worth_mf + total_worth_gold

        return jsonify({
            'success': True,
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC'),
            'totalWorth': round(total_worth, 2),
            'breakdown': {
                'stocks': {
                    'total': round(total_worth_stocks, 2),
                    'details': stocks_breakdown
                },
                'mutualFunds': {
                    'total': round(total_worth_mf, 2),
                    'details': mf_breakdown
                },
                'gold': {
                    'total': round(total_worth_gold, 2),
                    'details': gold_data if gold_data else None
                }
            }
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to calculate net worth: {str(e)}',
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
