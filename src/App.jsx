//import logo from './logo.svg';
import './App.css'

function App() {
  //const [count, setCount] = useState(0)

  let like = '즐겨찾기'; //사용자가 선택한 책장으로 자동 변경되게 하기
  let bookname = ['책이름1', '책이름2', '책이름3', '책이름4', '책이름5'];

  return (
    <div className='App'>
      <div className="nav">
        <h1 >디비디비딥</h1>        
      </div>
      <div className='list'>
        <h4>글제목</h4>
        <p>글 내용입니다만</p>
      </div>
      <div className='buttons'>
        <div className='button'>
          <h1>등록</h1>
        </div>
        <div className='button'>
          <h1>책장</h1>
        </div>
        <div className='button'>
          <h1>전체</h1>
        </div>
      </div>
      <div className='such'>
        검색
      </div>
      <hr className='line'/>
      <div className='bookcase'>
        <h1 className='casename'>{like}</h1>
        <div className='bookcase-list'>
          {bookname}
        </div>
      </div>
    </div>
  )
}

export default App
