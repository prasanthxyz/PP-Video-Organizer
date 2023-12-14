import * as React from 'react'
import { Col } from 'react-bootstrap'
import RPS from '../../components/RPS'

function SelectedCombination({ gs, showVid, isVideoPlaying }) {
  return (
    <Col>
      {gs.allCombinations.length === 0 ? (
        'No combination found!'
      ) : (
        <RPS
          combination={gs.allCombinations[gs.combinationIndex]}
          showVid={showVid}
          isVideoPlaying={isVideoPlaying}
        />
      )}
    </Col>
  )
}

export default SelectedCombination
