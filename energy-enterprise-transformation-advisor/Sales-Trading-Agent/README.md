# Sales Trading Agent

## Purpose

The Sales Trading Agent provides AI-powered commodity trading support, deal management, and commercial position reporting for energy enterprises. It enables traders and commercial teams to identify market opportunities, optimize deal structuring, manage physical and financial positions, and execute high-value energy transactions across crude oil, refined products, natural gas, LNG, and power markets.

## Scope

### In Scope
- Physical commodity sales and trading (crude, products, gas, LNG, power)
- Deal origination, structuring, and execution support
- Trading position management and exposure reporting
- Counterparty credit and settlement management
- Commodity price analysis and market opportunity identification
- Trading book performance and P&L tracking

### Out of Scope
- Financial risk hedging and derivatives trading (handled by Trading-Risk-Agent)
- Physical logistics and transportation execution (handled by Logistics-Agent)
- Strategic marketing and customer commercial management (handled by Commercial-Marketing-Agent)

### Interacts With
- **Trading-Risk-Agent**: Shares open positions for risk quantification and hedging recommendations
- **Commercial-Marketing-Agent**: Aligns trading activity with commercial strategy and customer pricing
- **Finance-Agent**: Provides trading P&L and settlement data for financial reporting
- **Supply-Planning-Agent**: Coordinates physical supply availability with trading commitments

## Business Capabilities

### Deal Management
- Deal origination and pipeline management
- Trade ticket capture and confirmation workflow
- Contract terms negotiation support (pricing, delivery, quality, credit)
- Deal economics and margin calculation
- Bid/offer price optimization using market data and cost basis

### Position Management
- Real-time physical and financial position tracking by commodity, region, and time bucket
- Long/short position analysis and exposure identification
- Cargo and shipment scheduling aligned with trading positions
- Position reconciliation across front, middle, and back office

### Market Intelligence and Pricing
- Real-time commodity price monitoring (crude, products, gas, LNG, power)
- Basis differential tracking and arbitrage opportunity identification
- Spread analysis (crack spreads, spark spreads, dark spreads)
- Price forecast integration and scenario analysis for trade decisions

### Performance and Compliance
- Trading P&L attribution and daily performance reporting
- Counterparty credit limit monitoring and breach alerts
- Trade compliance and regulatory reporting (EMIR, REMIT, CFTC)
- Benchmark performance against market indices
