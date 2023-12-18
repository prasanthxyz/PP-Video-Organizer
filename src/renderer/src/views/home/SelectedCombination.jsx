import * as React from 'react'
import { Col } from 'react-bootstrap'
import RPS from '../../components/RPS'

function SelectedCombination({ combinations, combinationIndex, showVid, isVideoPlaying }) {
  return (
    <Col>
      {combinations.length === 0 ? (
        'No combination found!'
      ) : (
        <RPS
          combination={combinations[combinationIndex]}
          showVid={showVid}
          isVideoPlaying={isVideoPlaying}
        />
      )}
    </Col>
  )
}

export default SelectedCombination
