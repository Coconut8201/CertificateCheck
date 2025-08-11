import winston from 'winston'

// 定義日誌格式
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
)

// 創建 logger 實例
const logger = winston.createLogger({
    level: 'debug',
    format: logFormat,
    transports: [
        // 控制台輸出
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(
                    (info: any) => {
                        const { level, message, timestamp, ...metadata } = info
                        let msg = `${timestamp} [${level}]: ${message}`
                        if (Object.keys(metadata).length > 0) {
                            msg += ` ${JSON.stringify(metadata)}`
                        }
                        return msg
                    }
                )
            ),
        }),
    ],
})

// 導出 logger 實例
export default logger
