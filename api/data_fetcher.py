import requests
from datetime import datetime, timedelta
import time


class SimpleMarketFetcher:
    def __init__(self):
        self.mf_api_url = 'https://api.mfapi.in/mf'
        self.alpha_vantage_api_key = 'DJHE492P815LH38W'  # Replace with your key
        self.gold_api_key = 'goldapi-6b6smb1e1a7y-io'  # Get from goldapi-6b6smb1e1a7y-io

    def get_stock_data_change(self, symbol, start_date):
        try:
            # Try different symbol formats with both exchanges
            symbol_formats = [
                f"{symbol}.NS",  # NSE
                f"{symbol}.BSE", # BSE alternative format
                f"{symbol}.BO",  # BSE
                symbol.upper()   # Plain symbol
            ]
            
            data = None
            used_symbol = None
            
            # Try each symbol format until we get data
            for sym in symbol_formats:
                try:
                    # First try GLOBAL_QUOTE for current price
                    base_url = 'https://www.alphavantage.co/query'
                    params = {
                        'function': 'GLOBAL_QUOTE',
                        'symbol': sym,
                        'apikey': self.alpha_vantage_api_key
                    }
                    
                    response = requests.get(base_url, params=params)
                    quote_data = response.json()
                    
                    # Check if we got valid data
                    if "Global Quote" in quote_data and quote_data["Global Quote"]:
                        # Now get historical data
                        params['function'] = 'TIME_SERIES_DAILY'
                        params['outputsize'] = 'compact'
                        
                        response = requests.get(base_url, params=params)
                        data = response.json()
                        
                        if "Time Series (Daily)" in data:
                            used_symbol = sym
                            break
                        
                except Exception as e:
                    print(f"Failed for {sym}: {str(e)}")
                    continue

            # If no data found, try fallback approach
            if not data or "Time Series (Daily)" not in data:
                # Try fallback to mock data for testing
                current_price = 100.0  # Mock price
                start_price = 95.0     # Mock starting price
                
                return {
                    'symbol': symbol.upper(),
                    'exchange_symbol': f"{symbol}.NS",
                    'current_price': current_price,
                    'start_price': start_price,
                    'absolute_change': round(current_price - start_price, 2),
                    'percent_change': round(((current_price - start_price) / start_price) * 100, 2),
                    'trend': 'positive' if current_price > start_price else 'negative',
                    'start_date': start_date,
                    'current_date': datetime.now().strftime("%Y-%m-%d"),
                    'price_history': [
                        {'date': (datetime.now() - timedelta(days=x)).strftime("%Y-%m-%d"), 
                         'price': 95.0 + x} 
                        for x in range(30)
                    ],
                    'source': 'fallback'
                }

            # Process actual data if available
            time_series = data["Time Series (Daily)"]
            dates = sorted(time_series.keys())
            
            current_date = dates[-1]
            current_price = float(time_series[current_date]['4. close'])
            
            start_date_obj = datetime.strptime(start_date, "%Y-%m-%d")
            valid_dates = [d for d in dates if datetime.strptime(d, "%Y-%m-%d") >= start_date_obj]
            start_date = valid_dates[0] if valid_dates else dates[0]
            start_price = float(time_series[start_date]['4. close'])
            
            absolute_change = current_price - start_price
            percent_change = (absolute_change / start_price) * 100
            trend = 'positive' if percent_change > 0 else 'negative' if percent_change < 0 else 'neutral'
            
            recent_dates = dates[-30:]
            price_history = [
                {'date': date, 'price': float(time_series[date]['4. close'])}
                for date in recent_dates
            ]

            return {
                'symbol': symbol.upper(),
                'exchange_symbol': used_symbol,
                'current_price': round(current_price, 2),
                'start_price': round(start_price, 2),
                'absolute_change': round(absolute_change, 2),
                'percent_change': round(percent_change, 2),
                'trend': trend,
                'start_date': start_date,
                'current_date': current_date,
                'price_history': price_history,
                'source': 'Alpha Vantage'
            }

        except Exception as e:
            print(f"Stock data fetch error for {symbol}: {str(e)}")
            return {
                'error': str(e),
                'symbol': symbol,
                'status': 'failed'
            }

    def get_mutual_fund_data(self, scheme_name):
        try:
            # Use AMFI API to fetch all mutual funds data
            # amfi_url = "https://www.amfiindia.com/spages/NAVAll.txt"
            response = requests.get(amfi_url, timeout=10)
            
            if response.status_code != 200:
                return {'error': 'Unable to fetch mutual fund data from AMFI'}

            # Parse the text response
            fund_data = {}
            current_scheme = None
            
            for line in response.text.split('\n'):
                line = line.strip()
                if not line or line.startswith(';'):
                    continue
                    
                parts = line.split(';')
                if len(parts) >= 6:  # Valid data line
                    scheme_code = parts[0]
                    scheme_name_full = parts[3]
                    nav = parts[4]
                    date = parts[5]
                    
                    fund_data[scheme_name_full.lower()] = {
                        'scheme_code': scheme_code,
                        'scheme_name': scheme_name_full,
                        'nav': float(nav),
                        'date': date
                    }

            # Find matching scheme
            matched_scheme = None
            search_term = scheme_name.lower()
            
            for full_name, data in fund_data.items():
                if search_term in full_name:
                    matched_scheme = data
                    break

            if not matched_scheme:
                return {'error': f"Scheme '{scheme_name}' not found in AMFI database"}

            return {
                'scheme_name': matched_scheme['scheme_name'],
                'scheme_code': matched_scheme['scheme_code'],
                'nav': matched_scheme['nav'],
                'date': matched_scheme['date'],
                'source': 'AMFI'
            }

        except Exception as e:
            print(f"Mutual fund data fetch error: {str(e)}")
            return {'error': str(e)}

    def get_gold_price_value(self, purity, weight):
        try:
            # Use Gold API for price data
            headers = {
                'x-access-token': self.gold_api_key,
                'Content-Type': 'application/json'
            }
            response = requests.get(
                'https://www.goldapi.io/api/XAU/INR',
                headers=headers
            )

            if response.status_code != 200:
                raise Exception("Failed to fetch gold price")

            data = response.json()
            price_per_gram_inr = data['price'] / 31.1035  # Convert from per oz to per g
            
            adjusted_price = price_per_gram_inr * (purity / 100)
            total_value = adjusted_price * weight

            return {
                'purity': purity,
                'weight_grams': weight,
                'price_per_gram': round(adjusted_price, 2),
                'total_value_inr': round(total_value, 2),
                'last_updated': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                'source': 'Gold API'
            }
        except Exception as e:
            print(f"Gold price fetch error: {str(e)}")
            # Fallback logic remains the same
            try:
                price_per_gram_inr = 9400
                adjusted_price = price_per_gram_inr * (purity / 100)
                total_value = adjusted_price * weight
                
                return {
                    'purity': purity,
                    'weight_grams': weight,
                    'price_per_gram': round(adjusted_price, 2),
                    'total_value_inr': round(total_value, 2),
                    'last_updated': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                    'source': 'fallback'
                }
            except Exception as inner_e:
                return {'error': f"Primary: {str(e)}, Fallback: {str(inner_e)}"}
