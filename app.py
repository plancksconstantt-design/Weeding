from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import psycopg2
import psycopg2.extras
import traceback
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Конфигурация базы данных
DB_CONFIG = {
    'host': 'localhost',
    'database': 'Weeding',
    'user': 'Anna',
    'password': '12Google121'
}

def get_db_connection():
    """Создание соединения с базой данных"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        return conn
    except Exception as e:
        print(f"Ошибка подключения к БД: {e}")
        return None

@app.route('/')
def index():
    """Главная страница - анкета"""
    try:
        return send_file('questionnaire.html')
    except Exception as e:
        return f"Ошибка загрузки файла questionnaire.html: {e}", 500

@app.route('/submit_anketa', methods=['POST'])
def submit_anketa():
    """Обработка отправки анкеты"""
    try:
        print("\n" + "="*50)
        print(f"Получена анкета в {datetime.now()}")
        print("="*50)
        print("Данные формы:", dict(request.form))
        
        # 1. Получаем имя и фамилию
        full_name = request.form.get('full_name', '').strip()
        if not full_name:
            return jsonify({
                'success': False, 
                'error': 'Пожалуйста, укажите Ваше имя и фамилию'
            })
        
        # 2. Присутствие
        attendance = request.form.get('attendance', '')
        if not attendance:
            return jsonify({
                'success': False, 
                'error': 'Пожалуйста, укажите, планируете ли Вы быть'
            })
        present = (attendance == 'yes')
        
        # 3. Количество гостей (три отдельных Boolean поля)
        guests = request.form.get('guests', '')
        guests1 = (guests == '1')
        guests2 = (guests == '2')
        guests3 = (guests == '3')
        
        # 4. Трансфер туда
        transfer_to = request.form.get('transfer_to', '')
        transfer_no = (transfer_to == 'no')
        transfer_ostrovets = (transfer_to == 'Ostrovets')
        transfer_mogilev = (transfer_to == 'Mogilev')
        
        # 5. Остается на продолжение
        stay = request.form.get('stay', '')
        stay_continuation = (stay == 'yes')
        
        # 6. Трансфер обратно
        transfer_back = request.form.get('transfer_back', '')
        transfer_back_no = (transfer_back == 'no')
        transfer_back_ostrovets = (transfer_back == 'Ostrovets')
        transfer_back_mogilev = (transfer_back == 'Mogilev')
        
        # 7. Напитки (множественный выбор) - все Boolean поля
        drinks = request.form.getlist('drinks')
        print(f"Выбранные напитки: {drinks}")
        
        white_dry = 'white_dry' in drinks          # белое_вино_сухое/полусухое
        white_sweet = 'white_sweet' in drinks      # белое_вино_сладкое/полусладкое
        red_dry = 'red_dry' in drinks              # красное_вино_сухое/полусухое
        red_sweet = 'red_sweet' in drinks          # красное_вино_сладкое/полусладкое
        sparkling = 'sparkling' in drinks          # игристое_вино
        vodka = 'vodka' in drinks                  # водка
        cognac = 'cognac' in drinks                # коньяк
        non_alcoholic = 'non_alcoholic' in drinks  # безалкогольные_напитки
        
        # 8. Любимая песня (текстовое поле)
        track = request.form.get('track', '').strip()
        
        # SQL запрос для вставки данных (со столбцом "песня")
        sql = '''
            INSERT INTO "Анкета" (
                "Фамилия_Имя",
                "Присутствие",
                "Количество_человек_1",
                "Количество_человек_2",
                "Количество_человек_3",
                "Трансфер_нет",
                "Трансфер_Островец",
                "Трансфер_Могилев",
                "Присутствие_на_продолжении",
                "Трансфер_обратно_нет",
                "Трансфер_обратно_Островец",
                "Трансфер_обратно_Могилев",
                "белое_вино_сухое/полусухое",
                "белое_вино_сладкое/полусладкое",
                "красное_вино_сухое/полусухое",
                "красное_вино_сладкое/полусладкое",
                "игристое_вино",
                "водка",
                "коньяк",
                "безалкогольные_напитки",
                "Песня"
            ) VALUES (
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
            )
        '''
        
        # Параметры для запроса
        params = (
            full_name,
            present,
            guests1,
            guests2,
            guests3,
            transfer_no,
            transfer_ostrovets,
            transfer_mogilev,
            stay_continuation,
            transfer_back_no,
            transfer_back_ostrovets,
            transfer_back_mogilev,
            white_dry,
            white_sweet,
            red_dry,
            red_sweet,
            sparkling,
            vodka,
            cognac,
            non_alcoholic,
            track if track else None  # Если трек не указан, сохраняем NULL
        )
        
        print(f"Сохраняем данные для: {full_name}")
        print(f"Любимая песня: {track if track else 'не указана'}")
        
        # Выполняем запрос к базе данных
        conn = get_db_connection()
        if conn is None:
            return jsonify({
                'success': False, 
                'error': 'Не удалось подключиться к базе данных. Проверьте, запущен ли PostgreSQL.'
            })
        
        cur = conn.cursor()
        cur.execute(sql, params)
        conn.commit()
        
        cur.close()
        conn.close()
        
        print(f"✓ Анкета успешно сохранена для {full_name}")
        print("="*50 + "\n")
        
        return jsonify({
            'success': True, 
            'message': f'Спасибо, {full_name}! Ваша анкета успешно отправлена.'
        })
        
    except psycopg2.Error as e:
        print(f"Ошибка базы данных: {e}")
        print(traceback.format_exc())
        return jsonify({
            'success': False, 
            'error': f'Ошибка базы данных: {str(e)}'
        })
    except Exception as e:
        print(f"Общая ошибка: {e}")
        print(traceback.format_exc())
        return jsonify({
            'success': False, 
            'error': f'Произошла ошибка: {str(e)}'
        })

@app.route('/all_anketas', methods=['GET'])
def all_anketas():
    """Получение всех анкет (для администратора)"""
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({'success': False, 'error': 'Ошибка подключения к БД'})
        
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute('SELECT * FROM "Анкета" ORDER BY "id" DESC')
        results = cur.fetchall()
        cur.close()
        conn.close()
        
        return jsonify({'success': True, 'data': results})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/stats', methods=['GET'])
def stats():
    """Статистика по анкетам"""
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({'success': False, 'error': 'Ошибка подключения к БД'})
        
        cur = conn.cursor()
        cur.execute('SELECT COUNT(*) FROM "Анкета"')
        total = cur.fetchone()[0]
        
        cur.execute('SELECT COUNT(*) FROM "Анкета" WHERE "Присутствие" = true')
        coming = cur.fetchone()[0]
        
        cur.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'stats': {
                'total': total,
                'coming': coming,
                'not_coming': total - coming
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

if __name__ == '__main__':
    print("\n" + "="*50)
    print("ЗАПУСК СЕРВЕРА АНКЕТИРОВАНИЯ")
    print("="*50)
    print("Адрес: http://127.0.0.1:5000")
    print("Страница анкеты: http://127.0.0.1:5000")
    print("Все анкеты: http://127.0.0.1:5000/all_anketas")
    print("Статистика: http://127.0.0.1:5000/stats")
    print("="*50)
    print("Структура таблицы 'Анкета':")
    print("- Фамилия_Имя (text)")
    print("- Присутствие (boolean)")
    print("- Количество_человек_1,2,3 (boolean)")
    print("- Трансфер_нет, Островец, Могилев (boolean)")
    print("- Присутствие_на_продолжении (boolean)")
    print("- Трансфер_обратно_нет, Островец, Могилев (boolean)")
    print("- белое_вино_сухое/полусухое (boolean)")
    print("- песня (text)")
    print("="*50 + "\n")
    
    app.run(debug=True, host='127.0.0.1', port=5000)