import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    cowinDataList: [],
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const url = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(url)

    if (response.ok === true) {
      const data = await response.json()
      const updateData = {
        last7DaysVaccination: data.last_7_days_vaccination.map(eachDayData => ({
          vaccineDate: eachDayData.vaccine_date,
          dose1: eachDayData.dose_1,
          dose2: eachDayData.dose_2,
        })),
        vaccinationByAge: data.vaccination_by_age.map(range => ({
          age: range.age,
          count: range.count,
        })),
        vaccinationByGender: data.vaccination_by_gender.map(genderType => ({
          gender: genderType.gender,
          count: genderType.count,
        })),
      }
      this.setState({
        cowinDataList: updateData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSuccessView = () => {
    const {cowinDataList} = this.state

    return (
      <>
        <VaccinationCoverage
          vaccinationCoverageDetails={cowinDataList.last7DaysVaccination}
        />
        <VaccinationByGender
          vaccinationByGenderDetails={cowinDataList.vaccinationByGender}
        />
        <VaccinationByAge
          vaccinationByAgeDetails={cowinDataList.vaccinationByAge}
        />
      </>
    )
  }

  renderFailureView = () => (
    <div className="failure-view">
      <img
        className="failure-image"
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1 className="failure-text">Something went wrong</h1>
    </div>
  )

  renderProgress = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderAllData = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderProgress()

      case apiStatusConstants.success:
        return this.renderSuccessView()

      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="bg-container">
        <div className="app-name-logo-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="logo"
          />
          <p className="app-name">Co-Win</p>
        </div>
        <h1 className="main-heading">CoWIN Vaccination in India</h1>
        {this.renderAllData()}
      </div>
    )
  }
}

export default CowinDashboard
