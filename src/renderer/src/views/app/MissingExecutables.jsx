import * as React from 'react'

export default function MissingExecutables({ packagesToInstall }) {
  return (
    <div id="missing-executables" className="fluid-container center-flex flex-col">
      <div className="font-larger">
        <p>Please ensure these are installed and available in PATH</p>
      </div>
      <table>
        {packagesToInstall.map(([name, instr, type]) => (
          <tr key={name}>
            <td>{name}</td>
            <td>{type === 'code' ? <code>{instr}</code> : <a href={instr}>{instr}</a>}</td>
          </tr>
        ))}
      </table>
    </div>
  )
}
